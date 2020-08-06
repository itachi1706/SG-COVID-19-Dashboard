const express = require('express');
const router = express.Router();

const auth = require('../api/firebase-auth');
const frontend = require('../api/firebase-frontend');
const {dbConfig} = require('../config');
const db = require('../api/db');
const dbUtil = require('../api/db-util');
const utilFunc = require('../util');
const { v4: uuidv4 } = require('uuid');
const csvConverter = require('json-2-csv');

const moment = require('moment');

const infoModel = require('../model/info');
const recalcModel = require('../model/recalculateDelta');

const defaultAdmObject = { route: 'admin', fbConfig: frontend.getFirebaseConfig(), username: "Unknown", loggedIn: false, appcommitsha: utilFunc.getCommitRev(), appver: utilFunc.getVersion(),
    appenv: utilFunc.getEnv() };

// Check Authentication. Unauthenticated users get kicked to login page
async function checkAuth(req, res, next) {
    let authCheck = await auth.checkAuth(req, res, next);
    if (authCheck) {
        defaultAdmObject.refreshToken = res.locals.refreshToken;
        defaultAdmObject.username = res.locals.name;
        defaultAdmObject.loggedIn = res.locals.authed;
        console.log('[ADMIN] User is authenticated');
        next();
        return;
    }
    console.log('[ADMIN] User is unauthenticated, kicking to login page');
    res.redirect('/login?err=1');
}

// noinspection JSCheckFunctionSignatures
router.use('/', checkAuth);

router.get('/', function (req, res) {
    res.redirect('/');
});

router.get('/add', async function (req, res) {
    let successthingy = '';
    if (req.query.success) successthingy = `Successfully added Day ${req.query.success} into Database`;
    if (req.query.fail) successthingy = `Failed to add Day ${req.query.fail}. Statistics for this day already exist`;

    let prevDayResults = [];
    let newDay = -1;

    let data = await dbUtil.getLastDay();
    if (data) {
        for (let d in data) {
            if (!data.hasOwnProperty(d)) continue;
            let t = {name: infoModel[d], val: data[d]};
            prevDayResults.push(t);
        }
        // Some autofill stats
        newDay = data.Day + 1;
        console.log("New Day: " + newDay);
    }

    // Set a default timestamp of today 1200h. Must format to something like "2019-01-01T11:11"
    let defaultDate = new Date();
    defaultDate.setHours(12, 0, 0);

    res.render('addstats', { ...defaultAdmObject, prevData: prevDayResults, model: infoModel, defaultDate: utilFunc.toISOLocal(defaultDate).substr(0, 16),
        newDay: newDay, prevDataRaw: JSON.stringify(data), suc: successthingy, title: 'Add New Day - Admin Panel - COVID-19 Dashboard (SG)' });
});

router.post('/add', async (req, res) => {
    let data = await dbUtil.getLastDay();
    res.render('confirmaddstats', {...defaultAdmObject, data: req.body, model: infoModel, prevDataRaw: JSON.stringify(data), title: 'Confirm Day Stats - Admin Panel - COVID-19 Dashboard (SG)'});
});

async function insertDelta(data) {
    let deltaSql = `INSERT INTO ${dbConfig.deltaTable} (Day, ConfirmedCases_Day, ImportedCase_Day, TotalLocalCase_Day, LocalLinked, LocalUnlinked, Hospital_OtherAreas, HospitalizedTotal, 
    HospitalizedStable, HospitalizedICU, HospitalizedOtherArea, Recovered_Day, Deaths_Day, CumulativeConfirmed, CumulativeImported, CumulativeLocal, CumulativeRecovered, CumulativeDeaths, 
    CumulativeDischarged, DailyQuarantineOrdersIssued, TotalCloseContacts, CompletedQuarantine, Quarantined, QUO_Pending, QUO_TransferHospital, QUO_NonGazettedDorm, QUO_GazettedDorm, QUO_GovtQuarantinedFacilities, 
    QUO_HomeQuarantinedOrder) VALUES (?) `; // We can just insert as it will never conflict

    let deltaArr = [ data.Day, data.dConfirmedCases_Day, data.dImportedCase_Day, data.dTotalLocalCase_Day, data.dLocalLinked, data.dLocalUnlinked, data.dHospital_OtherAreas,
        data.dHospitalizedTotal, data.dHospitalizedStable, data.dHospitalizedICU, data.dHospitalizedOtherArea, data.dRecovered_Day, data.dDeaths_Day, data.dCumulativeConfirmed,
        data.dCumulativeImported, data.dCumulativeLocal, data.dCumulativeRecovered, data.dCumulativeDeaths, data.dCumulativeDischarged, data.dDailyQuarantineOrdersIssued,
        data.dTotalCloseContacts, data.dCompletedQuarantine, data.dQuarantined, data.dQUO_Pending, data.dQUO_TransferHospital, data.dQUO_NonGazettedDorm,
        data.dQUO_GazettedDorm, data.dQUO_GovtQuarantinedFacilities, data.dQUO_HomeQuarantinedOrder ];

    try {
        return await db.query(deltaSql, [deltaArr]);
    } catch (e) {
        throw e;
    }
}

router.post('/add/:day', async (req, res) => {
    console.log(req.body);
    console.log("Adding to Database");
    let data = JSON.parse(JSON.stringify(req.body));
    for (let t in data) if (data.hasOwnProperty(t) && !isNaN(data[t])) data[t] = parseInt(data[t]);
    let date = new Date(data.Date);
    let mysqlDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
    console.log(mysqlDate);
    let infoSql = `INSERT INTO ${dbConfig.infoTable} VALUES (?)`; //We can just insert as it should not conflict
    // Craft array to insert
    let infoArr = [ data.Day, mysqlDate, data.ConfirmedCases_Day, data.ImportedCase_Day, data.TotalLocalCase_Day, data.LocalLinked, data.LocalUnlinked, data.Hospital_OtherAreas,
        data.HospitalizedTotal, data.HospitalizedStable, data.HospitalizedICU, data.HospitalizedOtherArea, data.Recovered_Day, data.Deaths_Day, data.CumulativeConfirmed,
        data.CumulativeImported, data.CumulativeLocal, data.CumulativeRecovered, data.CumulativeDeaths, data.CumulativeDischarged, data.DailyQuarantineOrdersIssued,
        data.TotalCloseContacts, data.Quarantined, data.CompletedQuarantine, data.DORSCON, data.QUO_Pending, data.QUO_TransferHospital, data.QUO_NonGazettedDorm,
        data.QUO_GazettedDorm, data.QUO_GovtQuarantinedFacilities, data.QUO_HomeQuarantinedOrder, ((data.Remarks) ? data.Remarks : null) ];

    try {
        let result = await db.query(infoSql, [infoArr]);
        console.log(`Added ${result.affectedRows} rows into Info Table`);
        let result2 = await insertDelta(data)
        console.log(`Added ${result2.affectedRows} rows into Delta Table with ID ${result2.insertId}`);
        console.log(`Finished adding day ${req.params.day}`);
        res.redirect(`/admin/add?success=${req.params.day}`);
    } catch (err) {
        console.log("ERROR");
        console.log(err);
        if (err.code === 'ER_DUP_ENTRY') res.redirect(`/admin/add?fail=${req.params.day}`);
        else res.redirect('/admin/add');
    }
});

const updateStatus = {};

async function recalc(uuid) {
    let data = updateStatus[uuid];
    data.start();
    while (data.currentDay <= data.endDay) {
        console.log(`Processing Day ${data.currentDay}`);
        let dbData = await db.query(`SELECT * FROM ${dbConfig.infoTable} WHERE Day >= ${data.currentDay - 1} LIMIT 2`);
        let delta = data.recalculate(dbData[0], dbData[1]);
        delta.Day = data.currentDay;
        await db.query(`DELETE FROM ${dbConfig.deltaTable} WHERE Day = ${data.currentDay}`);
        await insertDelta(delta);
        data.step();
    }
    data.complete();
}

router.get('/updateDelta', async (req, res) => {
    let result = await db.query(`SELECT Day FROM ${dbConfig.infoTable} ORDER BY Day DESC LIMIT 1`);
    res.render('recalculateDelta', {...defaultAdmObject, latestDay: result[0].Day, title: 'Recalculate Deltas - Admin Panel - COVID-19 Dashboard (SG)'});
});

router.get('/editDay', async (req, res) => {
    let result = await db.query(`SELECT Day FROM ${dbConfig.infoTable} ORDER BY Day DESC LIMIT 1`);
    let data = '';
    if (req.query.updateVal) data = `Updated Day ${req.query.updateVal} in the database`;
    res.render('recalculateDelta', {...defaultAdmObject, latestDay: result[0].Day, editMode: true, updated: data, title: 'Edit Day - Admin Panel - COVID-19 Dashboard (SG)'});
});

router.get('/editDay/:day', async (req, res) => {
    let result = await db.query(`SELECT * FROM ${dbConfig.infoTable} WHERE Day = ${req.params.day} LIMIT 1`);
    result = result[0];
    let prev = parseInt(req.params.day) - 1;
    if (prev <= 0) prev = 0;
    let prevday = await db.query(`SELECT * FROM ${dbConfig.infoTable} WHERE Day = ${prev} LIMIT 1`);
    if (typeof result === 'undefined') { res.redirect(404, '/admin/editDay'); return; }
    result.jsdate = moment(result.Date).format('YYYY-MM-DDTHH:mm');
    console.log(result);
    res.render('editstats', {...defaultAdmObject, data: result, day: req.params.day, model: infoModel, prevDataRaw: JSON.stringify(prevday[0])});
});

router.post('/updateDelta/:fromDay', async (req, res) => {
    console.log(`Recalculating from Day ${req.params.fromDay} to Day ${req.body.end}`);
    let identifier = uuidv4();
    console.log(`Associating with ${identifier}`);
    let data = new recalcModel(identifier, req.params.fromDay, req.body.end);
    updateStatus[identifier] = data;
    res.render('recalculateProgress', {...defaultAdmObject, uuid: data.uuid, state: data.state, title: 'Recalculating In Progress - Admin Panel - COVID-19 Dashboard (SG)'});
    setTimeout(function () {recalc(identifier);}, 2000);
});

router.get('/updateDelta/:uuid', async (req, res) => {
    res.json(updateStatus[req.params.uuid]);
});

router.get('/exportData', async (req, res) => {
    res.render('exportData', {...defaultAdmObject, title: 'Export Data - Admin Panel - COVID-19 Dashboard (SG)'});
});

router.post('/exportData', async (req, res) => {
    console.log(req.body);
    let expType = req.body.exportType;
    let tableExport = req.body.table;
    let sql = `SELECT * FROM ${dbConfig.infoTable}`;
    if (tableExport === 'delta') sql = `SELECT * FROM ${dbConfig.deltaTable}`;
    let fileName = `${tableExport}-${new Date().getTime()}`;

    try {
        let data = await db.query(sql);
        if (expType === 'csv') {
            res.writeHead(200, {'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=' + fileName + '.csv'});
            data = await convertToCsv(data);
        } else {
            // Allow JSON download
            res.writeHead(200, {'Content-Type': 'text/json', 'Content-Disposition': 'attachment; filename=' + fileName + '.json'});
            data = JSON.stringify(data);
        }
        res.end(data);
    } catch (e) {
        throw e;
    }
});

async function convertToCsv(data) {
    return await csvConverter.json2csvAsync(data, {checkSchemaDifferences: true, emptyFieldValue: ""});
}


module.exports = router;
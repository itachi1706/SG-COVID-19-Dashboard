const express = require('express');
const router = express.Router();

const frontend = require('../api/firebase-frontend');
const auth = require('../api/firebase-auth');
const db = require('../api/db');
const {dbConfig} = require('../config');

const defaultGraphObj = { fbConfig: frontend.getFirebaseConfig(), username: "Unknown", loggedIn: false, route: 'graphs' };

async function checkGraphAuth(req, res, next) {
  let token = await auth.checkAuth(req, res, next);
  defaultGraphObj.loggedIn = res.locals.authed;
  if (token) defaultGraphObj.username = res.locals.name;
  defaultGraphObj.refreshToken = res.locals.refreshToken;
  next();
}

// noinspection JSCheckFunctionSignatures
router.use('/', checkGraphAuth);

router.get('/cumulative', async function (req, res) {
  let chartOptions = {chart: {title: 'Cumulative Cases', subtitle: 'Confirmed and Discharged Cases over time'}, series: {0: {color: "#FF0000"}, 1: {color: '#00FF00'}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Cumulative Case Chart - COVID-19 Dashboard (SG)', gt: 'Cumulative Cases Chart',
    datasource: 'cumulative', type: "Line", co: JSON.stringify(chartOptions)});
});

router.get('/active', async function (req, res) {
  let chartOptions = {chart: {title: 'Active Cases', subtitle: 'Active cases in Singapore'}, series: {0: {color: "#FF0000"}, 1: {color: "#FFDF00"}, 2: {color: "#00FF00"}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Active Cases Chart - COVID-19 Dashboard (SG)', gt: 'Active Cases Chart',
    datasource: 'active', type: "Line", co: JSON.stringify(chartOptions)});
});

router.get('/confirmed', async function (req, res) {
  let chartOptions = {chart: {title: 'Confirmed Cases', subtitle: 'Daily Counts of Confirmed Cases'}, series: {0: {color: "#FF0000"}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Confirmed Case Chart - COVID-19 Dashboard (SG)', gt: 'Confirmed Cases Chart',
    datasource: 'confirmed', type: "Bar", co: JSON.stringify(chartOptions)});
});

router.get('/discharged', async function (req, res) {
  let chartOptions = {chart: {title: 'Discharged Cases', subtitle: 'Daily Counts of Cases discharged from hospital'}, series: {0: {color: "#00FF00"}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Discharged Case Chart - COVID-19 Dashboard (SG)', gt: 'Discharged Cases Chart',
    datasource: 'discharged', type: "Bar", co: JSON.stringify(chartOptions)});
});

router.get('/confirmeddischarged', async function (req, res) {
  let chartOptions = {chart: {title: 'Confirmed and Discharged Cases', subtitle: 'Daily confirmed and discharged cases in SG'}, series: {0: {color: "#FF0000"}, 1: {color: "#00FF00"}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Confirmed & Discharged Cases Chart - COVID-19 Dashboard (SG)', gt: 'Confirmed & Discharged Cases',
    datasource: 'confirmeddischarged', type: "Line", co: JSON.stringify(chartOptions)});
});

router.get('/quosummary', async function (req, res) {
  let chartOptions = {chart: {title: 'Quarantine Orders Issued', subtitle: 'Overall view of the total number of Quarantine Orders issued and completed'}, series: {0: {color: "#FF0000"}, 1: {color: "#00FF00"}, 2: {color: "#0000FF"}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Quarantine Orders Issued Summary Chart - COVID-19 Dashboard (SG)', gt: 'Quarantine Orders Issued Summary',
    datasource: 'quosummary', type: "Line", co: JSON.stringify(chartOptions)});
});

router.get('/quodaily', async function (req, res) {
  let chartOptions = {chart: {title: 'Daily Quarantine Orders Issued', subtitle: 'Total number of Quarantine Orders issued daily'}, series: {0: {color: "#0000FF"}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Daily Quarantine Orders Issued Chart - COVID-19 Dashboard (SG)', gt: 'Daily Quarantine Orders Issued',
    datasource: 'quodaily', type: "Bar", co: JSON.stringify(chartOptions)});
});

router.get('/quodetail', async function (req, res) {
  let chartOptions = {chart: {title: 'Active Quarantine Orders by Categories', subtitle: 'View of current Quarantine Orders and what category they belong to'}, series: {0: {color: "#FF0000"}, 1: {color: "#178C09"}, 2: {color: "#FFDF00"}, 3: {color: "#0000FF"}, 4: {color: "#810AA1"}, 5: {color: "#A10A81"}}};
  res.render('googlegraph', {...defaultGraphObj, title: 'Active Quarantine Orders (Categorized) Chart - COVID-19 Dashboard (SG)', gt: 'Active Quarantine Orders (Categorized) Chart',
    datasource: 'quodetail', type: "Line", co: JSON.stringify(chartOptions)});
});

router.get('/data/cumulative', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, CumulativeConfirmed, CumulativeDischarged FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, {id: "cnf", label: "Confirmed Cases", type: "number"}, { id: "dis", label: "Discharged Cases", type: "number" }];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.CumulativeConfirmed)}, {v: parseInt(d.CumulativeDischarged)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

router.get('/data/active', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, HospitalizedStable, HospitalizedICU, HospitalizedOtherArea FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, { id: "icu", label: "ICU", type: "number" }, { id: "ward", label: "Warded", type: "number" }, { id: "cf", label: "Community Facilities", type: "number" }];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.HospitalizedICU)}, {v: parseInt(d.HospitalizedStable)}, {v: parseInt(d.HospitalizedOtherArea)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

router.get('/data/confirmed', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, ConfirmedCases_Day FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, {id: "cnfd", label: "Confirmed Cases", type: "number"}];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.ConfirmedCases_Day)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

router.get('/data/discharged', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, Recovered_Day, Deaths_Day FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, { id: "disd", label: "Discharged Cases", type: "number" }];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.Recovered_Day) + parseInt(d.Deaths_Day)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

router.get('/data/confirmeddischarged', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, ConfirmedCases_Day, Recovered_Day, Deaths_Day FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, {id: "cnf", label: "Confirmed Cases", type: "number"}, { id: "disd", label: "Discharged Cases", type: "number" }];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.ConfirmedCases_Day)}, {v: parseInt(d.Recovered_Day) + parseInt(d.Deaths_Day)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

router.get('/data/quosummary', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, Quarantined, CompletedQuarantine, TotalCloseContacts FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, {id: "aquo", label: "Active Quarantine Orders", type: "number"}, { id: "cquo", label: "Completed Quarantine", type: "number" },
      { id: "tquo", label: "Total Quarantine Orders Issued", type: "number" }];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.Quarantined)}, {v: parseInt(d.CompletedQuarantine)}, {v: parseInt(d.TotalCloseContacts)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

router.get('/data/quodaily', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, DailyQuarantineOrdersIssued FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, {id: "cnf", label: "Orders Issued", type: "number"}];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.DailyQuarantineOrdersIssued)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

router.get('/data/quodetail', async function (req, res) {
  try {
    let output = await db.query(`SELECT Day, Date, QUO_Pending, QUO_TransferHospital, QUO_NonGazettedDorm, QUO_GazettedDorm, 
       QUO_GovtQuarantinedFacilities, QUO_HomeQuarantinedOrder FROM ${dbConfig.infoTable}`);
    let gDataShell = {};
    gDataShell.cols = [{label: "Time", type: "string"}, {id: "cnf", label: "Pending Extension/Gazetted Dorms", type: "number"}, { id: "disd", label: "Pending Quarantine Location", type: "number" },
      {id: "cnf", label: "Transfer to Hospital", type: "number"}, { id: "disd", label: "Non Gazetted Dorms", type: "number" }, {id: "cnf", label: "Government Quarantine Facilities", type: "number"},
      { id: "disd", label: "Home Quarantine Orders", type: "number" }];
    let rows = [];
    output.forEach((d) => {
      let date = new Date(d.Date);
      rows.push({c:[{v:date.toDateString()}, {v: parseInt(d.QUO_GazettedDorm)}, {v: parseInt(d.QUO_Pending)}, {v: parseInt(d.QUO_TransferHospital)},
          {v: parseInt(d.QUO_NonGazettedDorm)}, {v: parseInt(d.QUO_GovtQuarantinedFacilities)}, {v: parseInt(d.QUO_HomeQuarantinedOrder)}]});
    });
    gDataShell.rows = rows;
    res.json(gDataShell);
  } catch (e) {
    res.status(404);
    res.json({error: e});
    res.end();
  }
});

module.exports = router;

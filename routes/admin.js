const express = require('express');
const router = express.Router();

const auth = require('../api/firebase-auth');
const frontend = require('../api/firebase-frontend');
const {dbConfig} = require('../config');
const db = require('../api/db');
const dbUtil = require('../api/db-util');
const utilFunc = require('../util');

const infoModel = require('../model/info');

// Check Authentication. Unauthenticated users get kicked to login page
async function checkAuth(req, res, next) {
    let authCheck = await auth.checkAuth(req, res, next);
    if (authCheck) {
        console.log('[ADMIN] User is authenticated');
        next();
        return;
    }
    console.log('[ADMIN] User is unauthenticated, kicking to login page');
    res.redirect('/login?err=1');
}

// TODO: Reenable before pushing to prod
//router.use('/', checkAuth);

router.get('/', function (req, res) {
    console.log("uhhh");
    res.render('index', {title: "Admin Panel"});
});

router.get('/add', async function (req, res) {
    let prevDayResults = [];
    let newDay = -1;

    let data = await dbUtil.getLastDay();
    if (data) {
        for (let d in data) {
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

    res.render('addstats', { route: 'admin', fbConfig: frontend.getFirebaseConfig(), username: res.locals.name, loggedIn: res.locals.authed,
       prevData: prevDayResults, model: infoModel, defaultDate: utilFunc.toISOLocal(defaultDate).substr(0, 16), newDay: newDay, prevDataRaw: JSON.stringify(data) });
});

module.exports = router;
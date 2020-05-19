const express = require('express');
const router = express.Router();

const auth = require('../api/firebase-auth');
const frontend = require('../api/firebase-frontend');
const {dbConfig} = require('../config');
const db = require('../api/db');

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
    console.log(`SELECT * FROM ${dbConfig.infoTable}`);
    let prevDayResults = [];

    try {
        let result = await db.query(`SELECT * FROM ${dbConfig.infoTable} LIMIT 1`);
        let data = result[0]; // Only 1 record expected, the previous day records
        for (let d in data) {
            let t = {name: infoModel[d], val: data[d]};
            prevDayResults.push(t);
        }
    } catch (e) {
        console.log(e);
    }

    res.render('addstats', { route: 'admin', fbConfig: frontend.getFirebaseConfig(), username: res.locals.name, loggedIn: res.locals.authed,
       prevData: prevDayResults});
});

module.exports = router;
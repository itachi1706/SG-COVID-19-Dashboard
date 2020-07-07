const express = require('express');
const router = express.Router();

const frontend = require('../api/firebase-frontend');
const auth = require('../api/firebase-auth');
const db = require('../api/db');
const dbUtil = require('../api/db-util');
const {dbConfig} = require('../config');
const moment = require('moment');

const defaultObj = { fbConfig: frontend.getFirebaseConfig(), username: "Unknown", loggedIn: false };

async function checkAuth(req, res, next) {
  let token = await auth.checkAuth(req, res, next);
  defaultObj.loggedIn = res.locals.authed;
  if (token) defaultObj.username = res.locals.name;
  defaultObj.refreshToken = res.locals.refreshToken;
  next();
}

// noinspection JSCheckFunctionSignatures
router.use('/', checkAuth);

/* GET home page. */
router.get('/', async function(req, res) {
  let data = await dbUtil.getLastDay();
  let delta = await dbUtil.getDayDelta(data.Day);
  let icuIcon = (delta.HospitalizedICU > 0) ? '▲' : '▼';
  let wardIcon = (delta.HospitalizedStable > 0) ? '▲' : '▼';
  let cfIcon = (delta.HospitalizedOtherArea > 0) ? '▲' : '▼';
  let cTIcon = (delta.Hospital_OtherAreas > 0) ? '▲' : '▼';
  let icuClass = (delta.HospitalizedICU > 0) ? 'text-red' : 'text-green';
  let wardClass = (delta.HospitalizedStable > 0) ? 'text-red' : 'text-green';
  let cfClass = (delta.HospitalizedOtherArea > 0) ? 'text-red' : 'text-green';
  let cTClass = (delta.Hospital_OtherAreas > 0) ? 'text-red' : 'text-green';
  let date = data.Date;
  let dateString = `${moment(date).format('ddd DD MMM YYYY HH:mm:ss')} ${date.toString().split(' ').slice(5).join(' ')}`;
  delta.HospitalizedOtherArea = Math.abs(delta.HospitalizedOtherArea);
  delta.HospitalizedICU = Math.abs(delta.HospitalizedICU);
  delta.HospitalizedStable = Math.abs(delta.HospitalizedStable);
  delta.Hospital_OtherAreas = Math.abs(delta.Hospital_OtherAreas);
  res.render('main', { ...defaultObj, title: 'COVID-19 Dashboard (SG)', data: data, delta: delta, iI: icuIcon, iC: icuClass, wI: wardIcon, wC: wardClass,
    cI: cfIcon, cC: cfClass, cTI: cTIcon, cTC: cTClass, route: 'home', date: dateString });
});

router.get('/navbartest', function (req, res) {
  res.render('test-navbar', { ...defaultObj, route: 'cd' });
});

router.get('/login', function (req, res) {
  let error = '';
  if (req.query.err) error = auth.failErrors[req.query.err];
  if (error === auth.failErrors[1]) res.status(401); // Set 401 Unauthorized if coming from unauth users
  res.render('login', { ...defaultObj, route: '', errorCode: error, title: 'Login - COVID-19 Dashboard (SG)' })
});

router.get('/casehistory', async function (req, res) {
  res.render('viewcase', {...defaultObj, route: 'cd', title: 'View Case History - COVID-19 Dashboard (SG)'});
});

router.get('/statistics', async function (req, res) {
  res.render('viewstats', {...defaultObj, route: 'stats', title: 'View Daily Statistics - COVID-19 Dashboard (SG)'});
});

router.get('/statistics/:type', async function (req, res) {
  let output = {data: []};
  try {
    output.data = await db.query(`SELECT * FROM ${dbConfig.infoTable} WHERE Day > 0 ORDER BY Day DESC`);
    let deltas = await db.query(`SELECT * FROM ${dbConfig.deltaTable} WHERE Day > 0 ORDER BY Day DESC`);
    for (let d in output.data) {
      if (!output.data.hasOwnProperty(d)) continue;
      output.data[d].Date = moment(output.data[d].Date).format('DD/MM/YYYY hh:mm A');
      // insert deltas in
      for (let e in output.data[d]) {
        if (!output.data[d].hasOwnProperty(e)) continue;
        if (isNaN(deltas[d][e]) || e === 'Day') continue;
        let num = parseInt(deltas[d][e]);
        let className = 'text-red';
        let invertName = '▲';
        if (num <= 0) { className = 'text-green'; invertName = '▼'; num = Math.abs(num); }
        let invert = ['Recovered_Day', 'CumulativeRecovered', 'CumulativeDischarged', 'CompletedQuarantine'];
        if (invert.includes(e)) className = (className === 'text-red') ? 'text-green' : 'text-red';
        output.data[d][e] = output.data[d][e] + ` <span class='${className}'>(${invertName}${num})</span>`;
      }
    }
  } catch (e) {
    console.log(e);
  }
  res.json(output);
});


router.get('/casehistory/data', async function(req, res) {
  let output = {data: []};
  try {
    output.data = await db.query('SELECT * FROM sg_case_info ORDER BY CaseID ASC');
  } catch (e) {
    console.log(e);
  }
  res.json(output);
});

module.exports = router;

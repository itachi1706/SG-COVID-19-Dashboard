const express = require('express');
const router = express.Router();

const frontend = require('../api/firebase-frontend');
const auth = require('../api/firebase-auth');
const db = require('../api/db');
const dbUtil = require('../api/db-util');
const {dbConfig} = require('../config');

const defaultObj = { fbConfig: frontend.getFirebaseConfig(), username: "Unknown", loggedIn: false };

async function checkAuth(req, res, next) {
  let token = await auth.checkAuth(req, res, next);
  defaultObj.loggedIn = res.locals.authed;
  if (token) {
    defaultObj.username = res.locals.name;
  }
  next();
}

router.use('/', checkAuth);

/* GET home page. */
router.get('/', async function(req, res, next) {
  let data = await dbUtil.getLastDay();
  let delta = await dbUtil.getDayDelta(data.Day);
  let icuIcon = (delta.HospitalizedICU > 0) ? '▲' : '▼';
  let wardIcon = (delta.HospitalizedStable > 0) ? '▲' : '▼';
  let cfIcon = (delta.HospitalizedOtherArea > 0) ? '▲' : '▼';
  let icuClass = (delta.HospitalizedICU > 0) ? 'text-red' : 'text-green';
  let wardClass = (delta.HospitalizedStable > 0) ? 'text-red' : 'text-green';
  let cfClass = (delta.HospitalizedOtherArea > 0) ? 'text-red' : 'text-green';
  delta.HospitalizedOtherArea = Math.abs(delta.HospitalizedOtherArea);
  delta.HospitalizedICU = Math.abs(delta.HospitalizedICU);
  delta.HospitalizedStable = Math.abs(delta.HospitalizedStable);
  res.render('main', { ...defaultObj, title: 'COVID-19 Dashboard (SG)', data: data, delta: delta, iI: icuIcon, iC: icuClass, wI: wardIcon, wC: wardClass, cI: cfIcon, cC: cfClass, route: 'home' });
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
      output.data[d].Date = new Date(output.data[d].Date).toLocaleString();
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

router.get('/graph/cumulative', async function (req, res) {
  let chartOptions = {chart: {title: 'Cumulative Cases', subtitle: 'Confirmed and Discharged Cases over time'}, series: {0: {color: "#FF0000"}, 1: {color: '#00FF00'}}};
  res.render('googlegraph', {...defaultObj, route: 'graph', title: 'Cumulative Case Chart - COVID-19 Dashboard (SG)', gt: 'Cumulative Cases Chart',
    datasource: '/graphdata/cumulative', type: "Line", co: JSON.stringify(chartOptions)});
});

router.get('/graph/confirmed', async function (req, res) {
  let chartOptions = {chart: {title: 'Confirmed Cases', subtitle: 'Daily Counts of Confirmed Cases'}, series: {0: {color: "#FF0000"}}};
  res.render('googlegraph', {...defaultObj, route: 'graph', title: 'Confirmed Case Chart - COVID-19 Dashboard (SG)', gt: 'Confirmed Cases Chart',
    datasource: '/graphdata/confirmed', type: "Bar", co: JSON.stringify(chartOptions)});
});

router.get('/graphdata/cumulative', async function (req, res) {
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

router.get('/graphdata/confirmed', async function (req, res) {
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

module.exports = router;

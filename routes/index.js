const express = require('express');
const router = express.Router();

const frontend = require('../api/firebase-frontend');
const auth = require('../api/firebase-auth');
const db = require('../api/db');
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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

module.exports = router;

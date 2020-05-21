const express = require('express');
const router = express.Router();

const frontend = require('../api/firebase-frontend');
const auth = require('../api/firebase-auth');
const db = require('../api/db');

const defaultObj = { fbConfig: frontend.getFirebaseConfig(), username: "Unknown", loggedIn: false };

async function checkAuth(req, res, next) {
  let token = await auth.checkAuth(req, res, next);
  if (token) {
    defaultObj.username = res.locals.name;
    defaultObj.loggedIn = res.locals.authed;
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
  res.render('login', { ...defaultObj, route: '', errorCode: error })
});

router.get('/casehistory', async function (req, res) {
  res.render('viewcase', {...defaultObj, route: 'cd'});
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

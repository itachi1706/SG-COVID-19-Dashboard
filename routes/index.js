const express = require('express');
const router = express.Router();

const frontend = require('./firebase-frontend');
const {firebase, admin} = require('../config');
const auth = require('../api/firebase-auth');

function checkAuth(req, res, next) {
  if (auth.isAuthenticated()) {
    console.log("Auth Check: true");
    res.locals.authed = true;
  } else {
    console.log("Auth Check: false");
    res.locals.authed = false;
  }
  next();
}

router.use('/', checkAuth);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/navbartest', function (req, res) {
  res.render('test-navbar', { route: 'cd', username: auth.getName(), loggedIn: res.locals.authed });
});

router.get('/logout', async function (req, res) {
  await auth.logout();
  res.redirect('/navbartest');
});

router.get('/login', function (req, res) {
  let error = '';
  if (req.query.err) error = auth.failErrors[req.query.err];
  res.render('login', { route: '', errorCode: error, username: auth.getName(), loggedIn: res.locals.authed })
});

router.post('/login', async function (req, res) {
  console.log(req.body);
  console.log("hello");
  let result = await auth.login(req.body.email, req.body.password);
  if (result.success) {
    res.redirect('/navbartest'); // TODO: Replace with redirect url when available
  } else {
    let errorCode = auth.convertAuthCodeToError(result.message);
    res.redirect(`/login?err=${errorCode}`);
  }
});

module.exports = router;

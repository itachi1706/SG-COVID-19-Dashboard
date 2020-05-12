var express = require('express');
var router = express.Router();

var firebaseutil = require('./firebase');
var firebase = require('firebase');

function checkAuth(req, res, next) {
  if (req.header.authtoken) {
    console.log("Auth Check: true");
    req.loggedin = true;
  } else {
    console.log("Auth Check: false");
    req.loggedin = false;
  }
  next();
}

router.use('/', checkAuth);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/navbartest', function (req, res) {
  let loggedin = (req.query.log === '1');
  console.log(loggedin);
  res.render('test-navbar', { route: 'cd', fbconfig: firebaseutil.getConfigFrontend(), username: 'Test', loggedIn: loggedin });
});

router.get('/logout', function (req, res) {
  res.redirect('/navbartest');
});

router.get('/login', function (req, res) {
  res.render('login', { route: '', fbconfig: firebaseutil.getConfigFrontend() })
});

module.exports = router;

var express = require('express');
var router = express.Router();

var firebaseutil = require('./firebase');

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
})

module.exports = router;

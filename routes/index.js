var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/navbartest', function (req, res) {
  let loggedin = (req.query.log === '1');
  console.log(loggedin);
  res.render('test-navbar', { username: 'Test', loggedIn: loggedin, route: 'cd' });
});

router.get('/login', function (req, res) {
  res.redirect('/navbartest?log=1');
});

router.get('/logout', function (req, res) {
  res.redirect('/navbartest');
});

module.exports = router;

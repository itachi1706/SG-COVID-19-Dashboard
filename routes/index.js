const express = require('express');
const router = express.Router();

const frontend = require('./firebase-frontend');
const auth = require('../api/firebase-auth');

async function checkAuth(req, res, next) {
  await auth.checkAuth(req, res, next);
  next();
}

router.use('/', checkAuth);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/navbartest', function (req, res) {
  res.render('test-navbar', { route: 'cd', fbConfig: frontend.getFirebaseConfig(), username: res.locals.name, loggedIn: res.locals.authed });
});

router.get('/login', function (req, res) {
  let error = '';
  if (req.query.err) error = auth.failErrors[req.query.err];
  if (error === auth.failErrors[1]) res.status(401); // Set 401 Unauthorized if coming from unauth users
  res.render('login', { route: '', fbConfig: frontend.getFirebaseConfig(), errorCode: error, username: res.locals.name, loggedIn: res.locals.authed })
});

module.exports = router;

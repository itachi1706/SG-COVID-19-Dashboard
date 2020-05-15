const express = require('express');
const router = express.Router();

const frontend = require('./firebase-frontend');
const auth = require('../api/firebase-auth');

async function checkAuth(req, res, next) {
  let token = await auth.isAuthenticatedToken(req.cookies.authToken);
  if (token) {
    console.log("Auth Check: true");
    res.locals.authed = true;
    res.locals.name = auth.getName(token);
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
  res.render('test-navbar', { route: 'cd', fbConfig: frontend.getFirebaseConfig(), username: res.locals.name, loggedIn: res.locals.authed });
});

router.get('/login', function (req, res) {
  let error = '';
  if (req.query.err) error = auth.failErrors[req.query.err];
  res.render('login', { route: '', fbConfig: frontend.getFirebaseConfig(), errorCode: error, username: res.locals.name, loggedIn: res.locals.authed })
});

module.exports = router;

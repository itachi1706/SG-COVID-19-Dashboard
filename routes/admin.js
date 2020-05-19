const express = require('express');
const router = express.Router();

const auth = require('../api/firebase-auth');

// Check Authentication. Unauthenticated users get kicked to login page
async function checkAuth(req, res, next) {
    let authCheck = await auth.checkAuth(req, res, next);
    if (authCheck) {
        console.log('[ADMIN] User is authenticated');
        next();
        return;
    }
    console.log('[ADMIN] User is unauthenticated, kicking to login page');
    res.redirect('/login?err=1');
}

router.use('/', checkAuth);

router.get('/', function (req, res) {
    console.log("uhhh");
    res.render('index', {title: "Admin Panel"})
});

module.exports = router;
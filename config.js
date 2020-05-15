require('firebase-auth');
const firebase = require('firebase');
const admin = require('firebase-admin');

let firebaseConfig;
let serviceAccount = require("./service-account.json");
if(process.env.PRODMODE) {
    firebaseConfig = process.env.firebaseConfig;
}
else {
    let dev = require('./config-dev');
    firebaseConfig = dev.config;
}

firebase.initializeApp(firebaseConfig);
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

module.exports = { firebase, admin, firebaseConfig };
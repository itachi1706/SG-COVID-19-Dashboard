require('firebase-auth');
const firebase = require('firebase');
const admin = require('firebase-admin');

let firebaseConfig, serviceAccount;

if(process.env.PRODMODE) {
    firebaseConfig = process.env.firebaseConfig;
    //serviceAccount = require(process.env.firebaseSvcAcct);
    serviceAccount = process.env.firebaseSvcAcct;
}
else {
    let dev = require('./config-dev');
    firebaseConfig = dev.config;
    serviceAccount = require("./service-account.json");
}

firebase.initializeApp(firebaseConfig);
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

module.exports = { firebase, admin, firebaseConfig };
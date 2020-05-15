require('firebase-auth');
const firebase = require('firebase');
const admin = require('firebase-admin');

let firebaseConfig;
let serviceAccount = require("./service-account.json");
if(process.env.PRODMODE) {
    firebaseConfig = {
        apiKey: process.env.fbApi,
        authDomain: process.env.fbAuthDomain,
        databaseURL: process.env.fbDatabaseURL,
        projectId: process.env.fbProjId,
        storageBucket: process.env.fbStorage,
        messagingSenderId: process.env.fbMessage,
        appId: process.env.fbAppId,
        measurementId: process.env.fbMeasurement
    };
}
else {
    let dev = require('./config-dev');
    firebaseConfig = dev.config;
}

firebase.initializeApp(firebaseConfig);
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

module.exports = { firebase, admin, firebaseConfig };
require('firebase-auth');
const firebase = require('firebase');
const admin = require('firebase-admin');

let firebaseConfig, dbConfig;
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
    dbConfig = {
        host: process.env.dbHost,
        user: process.env.dbUser,
        password: process.env.dbPassword,
        database: process.env.dbDatabase,
        infoTable: process.env.dbInfo,
        deltaTable: process.env.dbDelta
    }
}
else {
    let dev = require('./config-dev');
    firebaseConfig = dev.config;
    dbConfig = dev.db;
}

firebase.initializeApp(firebaseConfig);
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

module.exports = { firebase, admin, firebaseConfig, dbConfig };
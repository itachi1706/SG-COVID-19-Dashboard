const {firebaseConfig} = require('../config');

module.exports.getFirebaseConfig = function () {
    return JSON.stringify(firebaseConfig);
}
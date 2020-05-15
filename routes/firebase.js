const config = require('./config');

module.exports.getConfigFrontend = function () {
    return JSON.stringify(config.firebaseConfig);
}
if(process.env.PRODMODE) {
    module.exports.firebaseConfig = process.env.firebaseConfig;
    module.exports.serviceAccount = require(process.env.firebaseSvcAcct);
}
else {
    let dev = require('./config-dev');
    module.exports.firebaseConfig = dev.config;
    module.exports.serviceAccount = require("/service-account.json");
}
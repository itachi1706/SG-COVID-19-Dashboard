if(process.env.PRODMODE) {
    module.exports.firebaseConfig = process.env.firebaseConfig;
}
else {
    let dev = require('./config-dev');
    module.exports.firebaseConfig = dev.config;
}
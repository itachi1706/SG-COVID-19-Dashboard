module.exports.toISOLocal = function(d) {
    let z  = n =>  ('0' + n).slice(-2);
    let zz = n => ('00' + n).slice(-3);
    let off = d.getTimezoneOffset();
    let sign = off < 0? '+' : '-';
    off = Math.abs(off);

    return d.getFullYear() + '-'
        + z(d.getMonth()+1) + '-' +
        z(d.getDate()) + 'T' +
        z(d.getHours()) + ':'  +
        z(d.getMinutes()) + ':' +
        z(d.getSeconds()) + '.' +
        zz(d.getMilliseconds()) +
        sign + z(off/60|0) + ':' + z(off%60);
}

// This will only be used in development
const fs = require('fs');
module.exports.getCommitRev = function () {
    let env = exports.getEnv();
    if (env === "development") return ` (${require('child_process').execSync('git rev-parse --short HEAD').toString().trim()})`;
    else {
        let path = './COMMITSHA';
        if (fs.existsSync(path)) return ` (${fs.readFileSync(path, 'utf8').trimEnd()})`;
        else {
            // Cannot find the file
            console.log("Production and failed to find COMMITSHA in app root folder. Omitting Commit Rev");
            return "";
        }
    }
}

module.exports.getEnv = function () {
    return process.env.NODE_ENV || "development";
}

module.exports.getVersion = function () {
    return require('./package.json').version;
}
const {dbConfig} = require('../config');
const db = require('./db');

module.exports.getLastDay = async function () {
    try {
        let result = await db.query(`SELECT * FROM ${dbConfig.infoTable} ORDER BY Day DESC LIMIT 1`);
        return result[0]; // Only 1 record expected, the previous day records
    } catch (e) {
        console.log(e);
        return {};
    }
}


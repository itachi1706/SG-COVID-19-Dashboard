const mysql = require('mysql');
const {dbConfig} = require('../config');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') console.error('Database connection was closed.');
        if (err.code === 'ER_CON_COUNT_ERROR') console.error('Database has too many connections.');
        if (err.code === 'ECONNREFUSED') console.error('Database connection was refused.');
    }
    if (connection) connection.release();
});

pool.query = util.promisify(pool.query);

// con.connect((err) => {
//     if (err) throw err;
//     console.log("Connected to MySQL DB");
// });

module.exports = pool;
const mysql = require('mysql2');
const {dbConfig} = require('../config');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

pool.escape = (val) => { return mysql.escape(val); };

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') console.error('Database connection was closed.');
        if (err.code === 'ER_CON_COUNT_ERROR') console.error('Database has too many connections.');
        if (err.code === 'ECONNREFUSED') console.error('Database connection was refused.');
    }
    if (connection) connection.release();
});

pool.query = util.promisify(pool.query);

module.exports = pool;
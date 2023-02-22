const { db } = require('./config/vars');
const mysql = require('mysql2/promise');

module.exports = {
    mysql,
    pool: mysql.createPool({
        ...db,
        dateStrings: true
    })
};

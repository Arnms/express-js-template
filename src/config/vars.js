const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '../../.env')
});

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        connectionLimit: process.env.DB_CONNECTION_LIMIT,
        timezone: process.env.DB_TIMEZONE
    }
};

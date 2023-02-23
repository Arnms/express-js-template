const { Sequelize } = require('sequelize');
const { db } = require('./vars');

const sequelize = new Sequelize({
    dialect: 'mysql',
    ...db
});

module.exports = sequelize;

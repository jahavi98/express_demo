const Sequelize = require('sequelize');
const db = new Sequelize('demo','root','',{
    host:"localhost",
    dialect:"mysql"
});

module.exports = db;
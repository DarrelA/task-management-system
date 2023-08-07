const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_ROOT_USER,
  process.env.MYSQL_ROOT_PASSWORD,
  {
    host: process.env.HOST,
    timezone: '+08:00', // for writing to database
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000,
      multipleStatements: true,
      timezone: '+08:00', // for reading from database
    },
    logging: false,
  }
);

module.exports = sequelize;

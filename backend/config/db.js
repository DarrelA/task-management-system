const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: { connectTimeout: 60000 },
    logging: false,
  }
);

module.exports = sequelize;

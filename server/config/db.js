const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_ROOT_USER,
  process.env.MYSQL_ROOT_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: { connectTimeout: 60000 },
    logging: false,
  }
);

module.exports = sequelize;

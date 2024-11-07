const { Sequelize } = require('sequelize');

const Database = new Sequelize(
  process.env.DATABASE_HOSTNAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host : process.env.DATABASE_IP,
    port : process.env.DATABASE_POST,
    dialect : process.env.DATABASE_DIALECT
  }
);

module.exports = Database;
const config = require("config");
const Sequelize = require("sequelize");

const dbPassword =
  process.env.NODE_ENV === "production" ? config.PASSWORD : config.EXT_PASSWORD;
const host = process.env.NODE_ENV === "production" ? "localhost" : config.HOST;
const sequelize = new Sequelize(config.DB, config.USER, dbPassword, {
  host: host,
  port: config.PORT,
  dialect: config.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./Users.model.js")(sequelize, Sequelize);
db.Results = require("./Results.model.js")(sequelize, Sequelize);

module.exports = db;

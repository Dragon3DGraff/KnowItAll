const config = require("config");
const Sequelize = require("sequelize");

const dbPassword =
  process.env.NODE_ENV !== "production"
    ? config.get("EXT_PASSWORD")
    : config.get("PASSWORD");
const host =
  process.env.NODE_ENV === "production" ? "localhost" : config.get("HOST");
const sequelize = new Sequelize(
  config.get("DB"),
  config.get("USER"),
  dbPassword,
  {
    host: host,
    // port: config.get("port"),
    dialect: config.get("dialect"),
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./Users.model.js")(sequelize, Sequelize);
db.Results = require("./Results.model.js")(sequelize, Sequelize);

module.exports = db;

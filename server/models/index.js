const config = require("config");
const Sequelize = require("sequelize");
const logger = require("../logger/Logger");

const dbPassword =
  process.env.NODE_ENV === "production"
    ? config.get("PASSWORD")
    : config.get("EXT_PASSWORD");
const host =
  process.env.NODE_ENV === "production" ? "localhost" : config.get("HOST");

const dbName =
  process.env.NODE_ENV === "production"
    ? config.get("DB")
    : config.get("DB-DEV");

const dbUser =
  process.env.NODE_ENV === "production"
    ? config.get("USER")
    : config.get("DB-DEV");

logger.info(`db name: ${dbName}, db user: ${dbUser}`);
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: host,
  // port: config.get("port"),
  dialect: config.get("dialect"),
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./Users.model.js")(sequelize, Sequelize);
db.Results = require("./Results.model.js")(sequelize, Sequelize);

module.exports = db;

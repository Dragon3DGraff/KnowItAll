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
db.shopping = require("./Shopping.model.js")(sequelize, Sequelize);
db.shoppingItems = require("./ShoppingItem.model.js")(sequelize, Sequelize);
db.listInvite = require("./ListInvite.model.js")(sequelize, Sequelize);
db.listBlockedUser = require("./ListBlockedUser.model.js")(sequelize, Sequelize);
db.listRefused = require("./ListRefused.model.js")(sequelize, Sequelize);

// Связь Список -> Товары
db.shopping.hasMany(db.shoppingItems, {
  foreignKey: "list_id",
  as: "items",
  onDelete: "CASCADE",
});
db.shoppingItems.belongsTo(db.shopping, {
  foreignKey: "list_id",
  as: "list",
});

// Связь Пользователь -> Списки
db.Users.hasMany(db.shopping, {
  foreignKey: "owner_id",
  as: "ownedLists",
});
db.shopping.belongsTo(db.Users, {
  foreignKey: "owner_id",
  as: "owner",
});

// ListInvite -> Shopping, Users (inviter, invitee)
db.listInvite.belongsTo(db.shopping, { foreignKey: "list_id", as: "list" });
db.shopping.hasMany(db.listInvite, { foreignKey: "list_id", as: "invites" });
db.listInvite.belongsTo(db.Users, { foreignKey: "inviter_id", as: "inviter" });
db.listInvite.belongsTo(db.Users, { foreignKey: "invitee_id", as: "invitee" });

module.exports = db;

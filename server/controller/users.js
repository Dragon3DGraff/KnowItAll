const logger = require("../logger/Logger");
const config = require("config");
const jwt = require("jsonwebtoken");

const db = require("../models");
const Users = db.Users;

const getUserId = async (req) => {
  const token = req.cookies.token;
  if (!token) {
    logger.info(`${req.url}: Нет токена`);
    return null;
  }

  const decoded = jwt.verify(token, config.get("jwtSecret"));
  if (!decoded.userId) {
    logger.info(`${req.url}: Не найден userId`);
    return null;
  }
  const userId = decoded.userId;

  const user = await Users.findByPk(userId);
  if (!user) {
    logger.info(`${req.url}: Не найден пользователь`);
    return null;
  }
  return userId;
};

module.exports = { getUserId };

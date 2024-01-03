const { Router } = require("express");
const router = Router();
const logger = require("../logger/Logger");
const userController = require("../controller/users");

const db = require("../models");
const Results = db.Results;
const Users = db.Users;
const sequelize = db.sequelize;

router.post(
  "/statistics",

  async (req, res) => {
    try {
      const user = await userController.getUser(req, res);

      if (!user) {
        return res.status(400).json({
          message: "User not found",
          errors: { login: "Пользователь не найден" },
        });
      }

      const userResults = await Results.findAll({
        where: { userId: user.id },
        order: [["updatedAt", "DESC"]],
      });
      if (!userResults) {
        logger.info(`${req.url}: Нет данных для ${req.body.uuid}`);
        return res.status(400).json({ message: "Не удалось найти данные" });
      }

      logger.info(`${req.url}: Нашел результаты для id: ${user.id}`);

      res.status(200).json({ data: userResults });
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

router.post(
  "/statistics/:id",

  async (req, res) => {
    console.log("Request Id:", req.params.id);
    try {
      const id = req.params.id;

      const userResults = await Results.findByPk(id);
      if (!userResults) {
        logger.info(`${req.url}: Нет данных для ${id}`);
        return res.status(400).json({ message: "Не удалось найти данные" });
      }

      logger.info(`${req.url}: Нашел результаты для id: ${id}`);

      const user = await Users.findByPk(userResults.userId);

      res
        .status(200)
        .json({ data: userResults, userName: user?.userName ?? "" });
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

router.get(
  "/statistics/all",

  async (req, res) => {
    try {
      const user = await userController.getUser(req, res);

      if (!user) {
        return res.status(200).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Нет доступа" });
      }

      const users = await Users.findAll({
        where: { role: ["student", "admin"] },
      });
      const usersCount = users.length;
      logger.info(`Зарегистрировалось: ${usersCount}`);

      // console.log(users.map((user) => user.userName));

      const userNames = users.map((user) => user.userName).join(", ");

      const anon = await Users.findAll({
        where: { role: ["anonim"] },
      });
      const anonCount = anon.length;
      logger.info(`anonim: ${anonCount}`);

      const results = await Results.findAll({
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("userId")), "userId"],
        ],
      });

      const resultsCount = results.length;

      logger.info(`Примеры решали: ${resultsCount}`);

      const surrende = await Results.findAll({
        where: { timer: 0 },
      });

      const surrendeCount = surrende.length;

      logger.info(`Сдались: ${surrendeCount}`);

      res.status(200).json({
        usersCount,
        anonCount,
        resultsCount,
        surrendeCount,
        userNames,
      });
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

module.exports = router;

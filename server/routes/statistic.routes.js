const { Router } = require("express");
const router = Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const logger = require("../logger/Logger");
const userController = require("../controller/users");

const db = require("../models");
const Results = db.Results;
const Users = db.Users;

router.post(
  "/statistics",

  async (req, res) => {
    try {
      const token = req.cookies.token;

      let userId = await userController.getUserId(req, token);

      //   if (!userId && req.body.uuid) {
      //     console.log("userId", userId);
      //     logger.info(
      //       `${req.url}: Попытка найти анонимного пользователя по ${req.body.uuid}`
      //     );
      //     const candidate = await Users.findOne({
      //       where: { userName: req.body.uuid },
      //     });
      //     if (!candidate) {
      //       logger.info(
      //         `${req.url}: Не нашел анонимного пользователя по ${req.body.uuid}`
      //       );
      //       return res.status(400).json({ message: "Не удалось найти данные" });
      //     }
      //     userId = candidate.id;
      //   }

      if (!userId) {
        logger.error(`${req.url}: Пользователь не найден`);

        return res.status(400).json({
          message: "User not found",
          errors: { login: "Пользователь не найден" },
        });
      }

      const userResults = await Results.findAll({
        where: { userId },
      });
      if (!userResults) {
        logger.info(`${req.url}: Нет данных для ${req.body.uuid}`);
        return res.status(400).json({ message: "Не удалось найти данные" });
      }

      logger.info(`${req.url}: Нашел результаты для id: ${userId}`);

      res.status(200).json({ data: userResults });
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
      const token = req.cookies.token;

      if (!token) {
        return res.status(200).json({ message: "No authorization" });
      }

      const decoded = jwt.verify(token, config.get("jwtSecret"));
      if (!decoded.userId) {
        res.clearCookie("token");
        return res.status(200).json({ message: "User not found" });
      }
      const userId = decoded.userId;

      const user = await Users.findByPk(userId);

      if (!user) {
        res.clearCookie("token");
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

      res
        .status(200)
        .json({ usersCount, anonCount, resultsCount, surrendeCount });
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

module.exports = router;
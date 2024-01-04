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

router.get(
  "/statistics/result/:id",

  async (req, res) => {
    try {
      const id = req.params.id;
      logger.info(`${req.url}: посик статистики для id: ${id}`);

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
      const start = new Date();
      const user = await userController.getUser(req, res);

      if (!user) {
        logger.info(`${req.url}: "User not found`);
        return res.status(200).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        logger.info(`${req.url}: Нет доступа`);
        return res.status(403).json({ message: "Нет доступа" });
      }

      const allResults = await Results.findAll();
      const resultsCount = allResults?.length;

      const users = await Users.findAll({
        where: { role: ["student", "admin"] },
      });
      const usersCount = users.length;

      const solveCountMap = new Map();

      allResults.forEach((element) => {
        const id = element.userId;
        solveCountMap.set(
          id,
          solveCountMap.has(id) ? solveCountMap.get(id) + 1 : 1
        );
      });

      const usersList = users?.map((user) => ({
        userName: user.userName,
        id: user.id,
        role: user.role,
        registered: user.registered,
        solved: solveCountMap.get(String(user.id)),
      }));

      const anon = await Users.findAll({
        where: { role: ["anonim"] },
      });
      const anonList = anon?.map((user) => ({
        userName: user.userName,
        id: user.id,
        role: user.role,
        registered: user.registered,
        solved: solveCountMap.get(String(user.id)),
      }));

      const surrende = await Results.findAll({
        where: { timer: 0 },
      });

      const surrendeCount = surrende?.length;

      const finish = new Date();
      logger.info(`${req.url}: выборку сделал за ${finish - start} мс`);

      res.status(200).json({
        usersCount,
        anonList,
        resultsCount,
        surrendeCount,
        usersList,
      });
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

router.get(
  "/statistics/user/:id",

  async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await userController.getUser(req, res);

      if (!user) {
        return res.status(200).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Нет доступа" });
      }

      const userResults = await Results.findAll({
        where: { userId },
        order: [["updatedAt", "DESC"]],
      });

      if (!userResults) {
        logger.info(`${req.url}: Нет данных для ${userId}`);
        return res.status(400).json({ message: "Не удалось найти данные" });
      }

      res.status(200).json(userResults);
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

module.exports = router;

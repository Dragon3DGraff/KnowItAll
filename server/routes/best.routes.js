const { Router } = require("express");
const router = Router();
const logger = require("../logger/Logger");
const userController = require("../controller/users");

const db = require("../models");
const { where } = require("sequelize");
const Results = db.Results;
const Users = db.Users;

router.get(
  "/best/",

  async (req, res) => {
    try {
      const user = await userController.getUser(req, res);

      if (!user) {
        logger.info(`${req.url}: "User not found`);
        return res.status(200).json({ message: "User not found" });
      }
      const users = await Users.findAll({
        where: {
          role: ["student", "admin"],
        },
      });
      const usersMap = new Map();
      users.forEach((item) => {
        usersMap.set(`${item.id}`, item.userName);
      });

      const best = await Results.findAll({
        where: {
          incorrectCount: 0,
          solvedCount: 38,
          numbers: ["2;3;4;5;6;7;8;9;10"],
          userId: [...usersMap.keys()],
        },
        order: [["timer", "ASC"]],
        limit: 10,
      });

      const result = [];

      for (let index = 0; index < best.length; index++) {
        const element = best[index];
        if (usersMap.has(element.userId)) {
          result.push({
            name: usersMap.get(element.userId),
            timer: element.timer,
            id: element.userId,
          });
        }
      }
      // best.forEach((item) => console.log(item.numbers));

      // const bestOne = await Results.findOne({
      //   where: {
      //     mode: "exam",
      //     solvedCount: 38,
      //     correctCount: 38,
      //     timer: { [Op.lt]: 74 },
      //   },
      //   //
      // });

      res.status(200).json(result);
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

module.exports = router;

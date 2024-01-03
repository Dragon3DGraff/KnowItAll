const { Router } = require("express");
const router = Router();
const logger = require("../logger/Logger");
const userController = require("../controller/users");

const { check, validationResult } = require("express-validator");

const db = require("../models");
const Results = db.Results;
const Users = db.Users;

router.post(
  "/results",
  check("results", "Нет данных")
    .exists()
    .isArray()
    .withMessage("results должен быть массивом"),
  check("timer", "Нет timer")
    .exists()
    .isNumeric()
    .withMessage("timer must be numeric"),
  check("mode")
    .exists()
    .withMessage("Mode is Requiered")
    .isString()
    .withMessage("Mode must be a String")
    .isIn(["exam", "train"])
    .withMessage("Mode does contain invalid value"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(`${req.url}: Incorrect data: ...`);
        logger.error(errors.array());

        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data",
        });
      }
      const mode = req.body.mode;
      const results = req.body.results;
      const timer = req.body.timer;
      const numbers = new Set();

      const solvedCount = results.length;
      let correctCount = 0;
      let incorrectCount = 0;

      results.forEach((result) => {
        if (result.result) {
          correctCount += 1;
        }
        if (!result.result) {
          incorrectCount += 1;
        }
        numbers.add(result.number2);
      });

      const data = {
        results,
        correctCount,
        incorrectCount,
        solvedCount,
        userId: null,
        date: new Date(),
        mode,
        numbers: [...numbers].sort((a, b) => a - b).join(";"),
        timer,
      };

      const user = await userController.getUser(req, res);

      let userId = user?.id;

      if (!userId && req.body.uuid) {
        logger.info(
          `${req.url}: Попытка найти анонимного пользователя по ${req.body.uuid}`
        );
        const candidate = await Users.findOne({
          where: { userName: req.body.uuid },
        });
        if (!candidate) {
          logger.info(
            `${req.url}: Не нашел анонимного пользователя по ${req.body.uuid}`
          );
          return res
            .status(400)
            .json({ message: "Не удалось сохранить результаты" });
        }
        userId = candidate.id;
      }

      if (!userId) {
        logger.error(`${req.url}: Пользователь не найден`);

        return res.status(400).json({
          message: "User not found",
          errors: { login: "Пользователь не найден" },
        });
      }

      data.userId = userId;
      const created = await Results.create(data);
      logger.info(`${req.url}: сохранил результаты для id: ${userId}`);

      res.status(201).json({ message: "resuts Saved!", id: created.id });
    } catch (error) {
      logger.error(`${req.url}: ошибка:${error.message ?? ""} ...`);
      logger.error(error);
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
);

module.exports = router;

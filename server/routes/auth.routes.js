const { Router } = require("express");
const router = Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const logger = require("../logger/Logger");

const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const crypto = require("crypto");

const db = require("../models");
const Users = db.Users;

router.post(
  "/checkLogin",
  check("login", "Введите логин").exists(),
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
      const { login } = req.body;

      const candidate = await Users.findOne({
        where: { login: login },
      });

      if (candidate) {
        logger.info(`${req.url}: Логин ${login} занят`);
        return res.status(200).json({ isFree: false });
      }

      return res.status(200).json({ isFree: true });
    } catch (error) {
      logger.error(`${req.url}: Ошибка: ${error.message ?? ""} ...`);
      logger.error(error);
    }
  }
);

router.post(
  "/register",
  check("userName", "Введите имя").exists(),
  check("login", "Введите логин").exists(),
  [
    check("password", "Пароль должен быть минимум 6 символов").isLength({
      min: 6,
    }),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(`${req.url}: Incorrect data:${error.message ?? ""} ...`);
        logger.error(errors.array());

        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect registration data",
        });
      }

      const { login, password } = req.body;

      const candidate = await Users.findOne({
        where: { login: login },
      });

      if (candidate) {
        logger.error(`Этот логин уже занят ${login}`);

        return res.status(400).json({
          message: "User is already exist",
          errors: { login: "Этот логин уже занят" },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const data = await Users.create({
        ...req.body,
        password: hashedPassword,
        registered: new Date(),
        role: "student",
      });
      if (data) {
        logger.info(`Account created! id: ${data}, userName: ${data.userName}`);

        res
          .status(201)
          .json({ message: "Account created!", userName: data.userName });
      }
    } catch (error) {
      res.status(500).json({ message: "ERROR" });
      logger.error(`${req.url}: Ошибка:${error.message ?? ""} ...`);
      logger.error(error);
    }
  }
);

router.post(
  "/login",
  [
    check("password", "Введите пароль").exists(),
    check("login", "Введите логин").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(`${req.url}: Incorrect data:${error.message ?? ""} ...`);
        logger.error(errors.array());

        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect login data",
        });
      }
      const { login, password } = req.body;
      const user = await Users.findOne({
        where: { login: login },
      });

      if (!user) {
        logger.error(`${req.url}: Пользователь не найден ${login}`);

        return res.status(400).json({
          message: "User not found",
          errors: { login: "Пользователь не найден" },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        logger.error(`${req.url}: Неверный пароль`);

        return res.status(400).json({
          message: "Wrong password",
          errors: { password: "Неверный пароль" },
        });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "7d",
      });

      res.clearCookie("token");
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
      });

      logger.info(`${req.url}: ${user.userName} залогинился`);

      res.json({ userId: user.id, userName: user.userName });
    } catch (error) {
      res.status(500).json({ message: "ERROR" });
      logger.error(`${req.url}: Ошибка:${error.message ?? ""} ...`);
      logger.error(error);
    }
  }
);

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.token;

    let userId;
    if (token) {
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      if (decoded.userId) {
        userId = decoded.userId;
      }
    }

    res.clearCookie("token");

    logger.info(`${req.url}: ${userId} разалогинился`);

    res.json({ userId: undefined, userName: undefined });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
    logger.error(`${req.url}: Ошибка:${error.message ?? ""} ...`);
    logger.error(error);
  }
});

router.post("/checkAuth", async (req, res) => {
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
    res.status(200).json({ userId, userName: user.userName });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
    logger.error(`${req.url}: Ошибка проверки:${error.message ?? ""} ...`);
    logger.error(error);
  }

  req.cookies;
});

router.post(
  "/registerAnon",

  async (req, res) => {
    try {
      const userName = crypto.randomUUID();
      const login = crypto.randomUUID();

      const hashedPassword = await bcrypt.hash(login, 12);

      const data = await Users.create({
        userName,
        login,
        password: hashedPassword,
        registered: new Date(),
        role: "anonim",
      });
      if (data) {
        logger.info(
          `${req.url}: Зарегистрирован анонимный пользователь ${userName}`
        );
        res
          .status(201)
          .json({ message: "Anon account created", uuid: userName });
      }
    } catch (error) {
      res.status(500).json({ message: "ERROR" });
      logger.error(`${req.url}: Ошибка:${error.message ?? ""} ...`);
      logger.error(error);
    }
  }
);

module.exports = router;

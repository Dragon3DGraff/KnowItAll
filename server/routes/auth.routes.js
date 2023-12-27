const { Router } = require("express");
const router = Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const db = require("../models");
const Users = db.Users;

router.get("/students", async (req, res) => {
  try {
    fs.appendFile("message.txt", "data to append", function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
    // 		const token = req.cookies.token;
    // 		if (!token) {
    // 			return res.status(401).json({ message: 'No authorization' })
    // 		}

    // 		const decoded = jwt.verify(token, config.get('jwtSecret'));
    // 		if(!decoded.userId){
    // 			res.clearCookie('token');
    // 			return res.status(400).json({message: 'User not found'});
    // 		}
    // 		const userId = decoded.userId;

    // 		const user = await User.findOne({_id: userId});

    // 		if(!user){
    // 			res.clearCookie('token');
    // 			return res.status(400).json({message: 'User not found'});
    // 		}
    res.status(200).json({ userId: 1, userName: "Матвей" });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
    console.log(error);
  }
});

router.post("/checkLogin", async (req, res) => {
  try {
    const { login } = req.body;
    await Users.sync();
    const candidate = await Users.findOne({
      where: { login: login },
    });

    if (candidate) {
      return res.status(200).json({ isFree: false });
    }

    return res.status(200).json({ isFree: true });
  } catch (error) {}
});

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
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect registration data",
        });
      }

      const { login, password } = req.body;
      await Users.sync();
      const candidate = await Users.findOne({
        where: { login: login },
      });

      if (candidate) {
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
      });
      if (data) {
        res
          .status(201)
          .json({ message: "Account created!", userName: data.userName });
      }
    } catch (error) {
      res.status(500).json({ message: "ERROR" });
      console.log(error);
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
        return res.status(400).json({
          message: "User not found",
          errors: { login: "Пользователь не найден" },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Wrong password",
          errors: { password: "Неверный пароль" },
        });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.clearCookie("token");
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
      });

      res.json({ userId: user.id, userName: user.userName });
    } catch (error) {
      res.status(500).json({ message: "ERROR" });
      console.log(error);
    }
  }
);

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ userId: undefined, userName: undefined });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

router.post("/checkAuth", async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "No authorization" });
    }

    const decoded = jwt.verify(token, config.get("jwtSecret"));
    if (!decoded.userId) {
      res.clearCookie("token");
      return res.status(400).json({ message: "User not found" });
    }
    const userId = decoded.userId;

    const user = await Users.findOne({ _id: userId });

    if (!user) {
      res.clearCookie("token");
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ userId, userName: user.userName });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
    console.log(error);
  }

  req.cookies;
});

module.exports = router;

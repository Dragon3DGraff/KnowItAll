const { Router } = require("express");
const router = Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const fsPromises = fs.promises;
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
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect resuts data",
        });
      }
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "No authorization" });
      }

      const decoded = jwt.verify(token, config.get("jwtSecret"));
      if (!decoded.userId) {
        res.clearCookie("token");
        return res.status(400).json({ message: "User not found" });
      }
      const userId = decoded.userId;

      const user = await Users.findByPk(userId);
      if (!user) {
        res.clearCookie("token");
        return res.status(400).json({ message: "User not found" });
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

      await Results.create({
        results,
        correctCount,
        incorrectCount,
        solvedCount,
        userId: user.id,
        date: new Date(),
        mode,
        numbers: [...numbers].sort((a, b) => a - b).join(";"),
        timer,
      });

      res.status(201).json({ message: "resuts Saved!" });
    } catch (error) {
      res.status(500).json({ message: error });
      await fsPromises.appendFile("errors.txt", JSON.stringify(error) + "\n");
      console.log(error);
    }
  }
);

module.exports = router;

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
  "/resuts",
  check("results", "Нет данных").exists(),
  check("timer", "Нет timer").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect registration data",
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

      await Results.create({
        ...req.body,
        userId: user.id,
        date: new Date(),
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

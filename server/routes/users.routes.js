const { Router } = require("express");
const router = Router();

const auth = require("../middleware/auth.middleware");
const db = require("../models");
const Users = db.Users;

router.get("/search", auth, async (req, res) => {
  try {
    const login = (req.query.login || "").trim();
    if (!login) {
      return res.status(400).json({ message: "login is required" });
    }

    const user = await Users.findOne({
      where: { login },
      attributes: ["id", "userName"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId: user.id, userName: user.userName });
  } catch (e) {
    console.error("User search error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const user = await Users.findByPk(id, {
      attributes: ["id", "userName", "login"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      userId: user.id,
      userName: user.userName,
      login: user.login,
    });
  } catch (e) {
    console.error("User by id error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

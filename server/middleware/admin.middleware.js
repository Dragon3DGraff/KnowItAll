const userController = require("../controller/users");

module.exports = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No authorization" });
    }

    const user = await userController.getUser(req, res);

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Ошибка проверки прав" });
  }
};

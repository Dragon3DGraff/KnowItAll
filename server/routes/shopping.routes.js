const { Router } = require("express");
const { Op } = require("sequelize");
const router = Router();

const auth = require("../middleware/auth.middleware");
const db = require("../models");

// Достаем модели
const Shopping = db.shopping;
const ShoppingItem = db.shoppingItems;

// Хелпер для проверки доступа (Владелец или Участник)
const hasAccess = (list, userId) => {
  if (!list) return false;

  let members = list.members || [];
  if (typeof members === "string") {
    try {
      members = JSON.parse(members);
    } catch (e) {
      members = [];
    }
  }

  return list.owner_id === userId || members.includes(Number(userId));
};

// --- 1. ПОЛУЧИТЬ ВСЕ СПИСКИ (Свои + Общие) ---
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Ищем списки, где я владелец ИЛИ мой ID есть в массиве members
    const lists = await Shopping.findAll({
      where: {
        [Op.or]: [
          { owner_id: userId },
          db.sequelize.literal(
            `JSON_CONTAINS(members, CAST('${userId}' AS JSON))`
          ),
        ],
      },
      order: [["updated_at", "DESC"]],
    });

    res.json(lists);
  } catch (e) {
    console.error("Error fetching lists:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 2. СОЗДАТЬ ИЛИ ОБНОВИТЬ СПИСОК ---
router.post("/", auth, async (req, res) => {
  try {
    const { id, title, updated_at, members } = req.body;
    const userId = req.user.userId;

    const existingList = await Shopping.findByPk(id);

    if (existingList) {
      if (!hasAccess(existingList, userId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const isOwner = existingList.owner_id === userId;

      await existingList.update({
        title,
        theme_color: themeColor,
        updated_at: updated_at || Date.now(),
        // Менять состав участников может только Владелец
        members: isOwner && members ? members : existingList.members,
      });
    } else {
      await Shopping.create({
        id,
        owner_id: userId,
        title,
        members: members || [],
        updated_at: updated_at || Date.now(),
      });
    }

    res.status(201).json({ message: "Saved" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error saving list" });
  }
});

// --- 3. УДАЛИТЬ СПИСОК (Или покинуть его) ---
router.delete("/:id", auth, async (req, res) => {
  try {
    const listId = req.params.id;
    const userId = req.user.userId;

    const list = await Shopping.findByPk(listId);
    if (!list) return res.status(404).json({ message: "Not found" });

    // Сценарий А: Владелец удаляет список
    if (list.owner_id === userId) {
      // Удаляем товары
      await ShoppingItem.destroy({ where: { list_id: listId } });
      // Удаляем список
      await list.destroy();
      return res.json({ message: "List deleted permanently" });
    }

    // Сценарий Б: Участник покидает список (удаляет себя из members)
    let members = list.members || [];
    if (typeof members === "string") {
      try {
        members = JSON.parse(members);
      } catch (e) {
        members = [];
      }
    }

    const numUserId = Number(userId);
    if (members.includes(numUserId)) {
      // Фильтруем массив, убирая текущего юзера
      const newMembers = members.filter((id) => id !== numUserId);

      await list.update({
        members: newMembers,
        updated_at: Date.now(), // Обновляем время, чтобы другие увидели изменение состава
      });

      return res.json({ message: "You left the list" });
    }

    // Сценарий В: Чужой человек пытается удалить (403)
    return res.status(403).json({ message: "Access denied" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error deleting" });
  }
});

// --- 4. ПОЛУЧИТЬ ТОВАРЫ ---
router.get("/:id/items", auth, async (req, res) => {
  try {
    const listId = req.params.id;
    const userId = req.user.userId;

    const list = await Shopping.findByPk(listId);

    if (!hasAccess(list, userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const items = await ShoppingItem.findAll({
      where: { list_id: listId },
      order: [
        ["position", "ASC"],
        ["updated_at", "DESC"],
      ],
    });

    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching items" });
  }
});

// --- 5. СОХРАНИТЬ ТОВАР ---
router.post("/item", auth, async (req, res) => {
  try {
    const { id, list_id, text, is_completed, position, updated_at } = req.body;
    const userId = req.user.userId;

    const list = await Shopping.findByPk(list_id);

    if (!hasAccess(list, userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await ShoppingItem.upsert({
      id,
      list_id,
      text,
      is_completed,
      position: position || 0,
      updated_at: updated_at || Date.now(),
    });

    await Shopping.update(
      { updated_at: Date.now() },
      { where: { id: list_id } }
    );

    res.json({ status: "ok" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error saving item" });
  }
});

// --- 6. УДАЛИТЬ ТОВАР ---
router.delete("/item/:id", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.userId;

    const item = await ShoppingItem.findByPk(itemId);
    if (!item) return res.status(200).json({ message: "Already deleted" });

    const list = await Shopping.findByPk(item.list_id);

    if (!hasAccess(list, userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await item.destroy();

    await Shopping.update(
      { updated_at: Date.now() },
      { where: { id: list.id } }
    );

    res.json({ message: "Item deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error deleting item" });
  }
});

module.exports = router;

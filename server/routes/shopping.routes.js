const { Router } = require("express");
const { Op } = require("sequelize");
const router = Router();

const auth = require("../middleware/auth.middleware");
const db = require("../models");

const Shopping = db.shopping;
const ShoppingItem = db.shoppingItems;
const ListInvite = db.listInvite;
const ListBlockedUser = db.listBlockedUser;
const ListRefused = db.listRefused;

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
      include: [
        { model: db.Users, as: "owner", attributes: ["userName"] },
      ],
    });

    const payload = await Promise.all(
      lists.map(async (list) => {
        const row = list.toJSON();
        row.owner_user_name = list.owner?.userName ?? null;
        delete row.owner;
        if (list.owner_id === userId) {
          const pending = await ListInvite.findAll({
            where: { list_id: list.id },
            include: [
              { model: db.Users, as: "invitee", attributes: ["id", "userName"] },
            ],
          });
          row.pending_invites = pending.map((inv) => {
            const j = inv.toJSON();
            return {
              inviteeId: j.invitee_id,
              inviteeName: j.invitee?.userName ?? "",
            };
          });
        }
        return row;
      })
    );

    res.json(payload);
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

    const parseMembers = (m) => {
      if (!m || !Array.isArray(m)) return [];
      return m.map((x) => Number(x)).filter((x) => !Number.isNaN(x));
    };

    if (existingList) {
      if (!hasAccess(existingList, userId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const isOwner = existingList.owner_id === userId;
      const currentMembers = parseMembers(existingList.members);
      const incomingMembers = parseMembers(members);
      const newMemberIds = incomingMembers.filter((mid) => !currentMembers.includes(mid));

      if (isOwner && newMemberIds.length > 0) {
        for (const inviteeId of newMemberIds) {
          const blocked = await ListBlockedUser.findOne({
            where: { blocker_id: inviteeId, blocked_id: userId },
          });
          if (blocked) continue;

          const refused = await ListRefused.findOne({
            where: { user_id: inviteeId, list_id: existingList.id },
          });
          if (refused) continue;

          await ListInvite.findOrCreate({
            where: { list_id: existingList.id, invitee_id: inviteeId },
            defaults: { inviter_id: userId, list_id: existingList.id, invitee_id: inviteeId },
          });
        }
      }

      const membersToSave = isOwner && members ? incomingMembers : existingList.members;

      await existingList.update({
        title,
        updated_at: updated_at || Date.now(),
        members: membersToSave,
      });
    } else {
      await Shopping.create({
        id,
        owner_id: userId,
        title,
        members: [],
        updated_at: updated_at || Date.now(),
      });

      const incomingMembers = parseMembers(members);
      for (const inviteeId of incomingMembers) {
        const blocked = await ListBlockedUser.findOne({
          where: { blocker_id: inviteeId, blocked_id: userId },
        });
        if (blocked) continue;

        const refused = await ListRefused.findOne({
          where: { user_id: inviteeId, list_id: id },
        });
        if (refused) continue;

        await ListInvite.findOrCreate({
          where: { list_id: id, invitee_id: inviteeId },
          defaults: { inviter_id: userId, list_id: id, invitee_id: inviteeId },
        });
      }
    }

    res.status(201).json({ message: "Saved" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error saving list" });
  }
});

// --- 2b. GET ПРИГЛАШЕНИЙ (до /:id) ---
router.get("/invites", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const invites = await ListInvite.findAll({
      where: { invitee_id: userId },
      include: [
        { model: db.shopping, as: "list", attributes: ["id", "title"] },
        { model: db.Users, as: "inviter", attributes: ["id", "userName"] },
      ],
    });

    const payload = invites.map((inv) => {
      const row = inv.toJSON();
      return {
        inviteId: row.id,
        listId: row.list_id,
        listTitle: row.list?.title ?? "",
        sharerId: row.inviter_id,
        sharerName: row.inviter?.userName ?? "",
      };
    });

    res.json(payload);
  } catch (e) {
    console.error("Error fetching invites:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 2c. ПРИНЯТЬ ПРИГЛАШЕНИЕ ---
router.post("/invites/:id/accept", auth, async (req, res) => {
  try {
    const inviteId = req.params.id;
    const userId = req.user.userId;

    const invite = await ListInvite.findByPk(inviteId, {
      include: [{ model: db.shopping, as: "list" }],
    });
    if (!invite || invite.invitee_id !== userId) {
      return res.status(404).json({ message: "Not found" });
    }

    const list = invite.list;
    if (!list) return res.status(404).json({ message: "List not found" });

    let members = list.members || [];
    if (typeof members === "string") {
      try {
        members = JSON.parse(members);
      } catch (e) {
        members = [];
      }
    }
    if (!members.includes(userId)) {
      members = [...members, userId];
    }

    await list.update({
      members,
      updated_at: Date.now(),
    });
    await invite.destroy();

    res.json({ message: "Accepted" });
  } catch (e) {
    console.error("Error accepting invite:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 2d. ОТКЛОНИТЬ ПРИГЛАШЕНИЕ ---
router.post("/invites/:id/decline", auth, async (req, res) => {
  try {
    const inviteId = req.params.id;
    const userId = req.user.userId;
    const { reason } = req.body || {};

    const invite = await ListInvite.findByPk(inviteId);
    if (!invite || invite.invitee_id !== userId) {
      return res.status(404).json({ message: "Not found" });
    }

    if (reason === "forever_list") {
      await ListRefused.findOrCreate({
        where: { user_id: userId, list_id: invite.list_id },
        defaults: { user_id: userId, list_id: invite.list_id },
      });
    }
    if (reason === "block_user") {
      await ListBlockedUser.findOrCreate({
        where: { blocker_id: userId, blocked_id: invite.inviter_id },
        defaults: { blocker_id: userId, blocked_id: invite.inviter_id },
      });
    }

    await invite.destroy();
    res.json({ message: "Declined" });
  } catch (e) {
    console.error("Error declining invite:", e);
    res.status(500).json({ message: "Server error" });
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

// --- 3b. ВЫЙТИ ИЗ СПИСКА (участник — убрать себя; владелец — передать права первому) ---
router.post("/:id/leave", auth, async (req, res) => {
  try {
    const listId = req.params.id;
    const userId = req.user.userId;

    const list = await Shopping.findByPk(listId);
    if (!list) return res.status(404).json({ message: "Not found" });

    if (!hasAccess(list, userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    let members = list.members || [];
    if (typeof members === "string") {
      try {
        members = JSON.parse(members);
      } catch (e) {
        members = [];
      }
    }

    const numUserId = Number(userId);

    if (list.owner_id === userId) {
      if (members.length > 0) {
        const newOwnerId = members[0];
        const newMembers = members.slice(1);
        await list.update({
          owner_id: newOwnerId,
          members: newMembers,
          updated_at: Date.now(),
        });
        return res.json({ message: "You left the list; ownership transferred" });
      }
      await ShoppingItem.destroy({ where: { list_id: listId } });
      await list.destroy();
      return res.json({ message: "List deleted (no members left)" });
    }

    if (members.includes(numUserId)) {
      const newMembers = members.filter((id) => id !== numUserId);
      await list.update({
        members: newMembers,
        updated_at: Date.now(),
      });
      return res.json({ message: "You left the list" });
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error leaving list" });
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

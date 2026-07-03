const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const db = require("../models");
const logger = require("../logger/Logger");
const { listBooks, readBookById } = require("../utils/parseBook");

const BookProgress = db.bookProgress;
const BookBookmark = db.bookBookmark;

const VALID_VIEW_MODES = ["page", "chapter", "scroll"];

router.get("/", auth, async (req, res) => {
  try {
    res.json(listBooks());
  } catch (error) {
    logger.error(`books list error: ${error.message}`);
    res.status(500).json({ message: "Ошибка получения списка книг" });
  }
});

router.get("/:id/progress", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!readBookById(id)) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    const progress = await BookProgress.findOne({
      where: { user_id: userId, book_id: id },
    });

    if (!progress) {
      return res.json({
        view_mode: "scroll",
        font_size: 18,
        position: { chapterIndex: 0, pageIndex: 0, scrollTop: 0 },
      });
    }

    res.json({
      view_mode: progress.view_mode,
      font_size: progress.font_size,
      position: progress.position,
    });
  } catch (error) {
    logger.error(`book progress get error: ${error.message}`);
    res.status(500).json({ message: "Ошибка получения прогресса" });
  }
});

router.put("/:id/progress", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { view_mode, font_size, position } = req.body;

    if (!readBookById(id)) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    if (view_mode && !VALID_VIEW_MODES.includes(view_mode)) {
      return res.status(400).json({ message: "Неверный режим отображения" });
    }

    const fontSizeNum = font_size != null ? Number(font_size) : 18;
    if (fontSizeNum < 12 || fontSizeNum > 32) {
      return res.status(400).json({ message: "Неверный размер шрифта" });
    }

    const [progress] = await BookProgress.findOrCreate({
      where: { user_id: userId, book_id: id },
      defaults: {
        user_id: userId,
        book_id: id,
        view_mode: view_mode || "scroll",
        font_size: fontSizeNum,
        position: position || { chapterIndex: 0, pageIndex: 0, scrollTop: 0 },
      },
    });

    await progress.update({
      view_mode: view_mode || progress.view_mode,
      font_size: fontSizeNum,
      position: position || progress.position,
    });

    res.json({ ok: true });
  } catch (error) {
    logger.error(`book progress save error: ${error.message}`);
    res.status(500).json({ message: "Ошибка сохранения прогресса" });
  }
});

router.get("/:id/bookmarks", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!readBookById(id)) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    const bookmarks = await BookBookmark.findAll({
      where: { user_id: userId, book_id: id },
      order: [["createdAt", "ASC"]],
    });

    res.json(
      bookmarks.map((b) => ({
        id: b.id,
        label: b.label,
        position: b.position,
        created_at: b.createdAt,
      }))
    );
  } catch (error) {
    logger.error(`book bookmarks get error: ${error.message}`);
    res.status(500).json({ message: "Ошибка получения закладок" });
  }
});

router.post("/:id/bookmarks", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { label, position } = req.body;

    if (!readBookById(id)) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    if (!position || typeof position !== "object") {
      return res.status(400).json({ message: "Не указана позиция закладки" });
    }

    const bookmark = await BookBookmark.create({
      user_id: userId,
      book_id: id,
      label: label || "Закладка",
      position,
    });

    res.status(201).json({
      id: bookmark.id,
      label: bookmark.label,
      position: bookmark.position,
      created_at: bookmark.createdAt,
    });
  } catch (error) {
    logger.error(`book bookmark create error: ${error.message}`);
    res.status(500).json({ message: "Ошибка создания закладки" });
  }
});

router.delete("/:id/bookmarks/:bookmarkId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id, bookmarkId } = req.params;

    const bookmark = await BookBookmark.findOne({
      where: { id: bookmarkId, user_id: userId, book_id: id },
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Закладка не найдена" });
    }

    await bookmark.destroy();
    res.json({ ok: true });
  } catch (error) {
    logger.error(`book bookmark delete error: ${error.message}`);
    res.status(500).json({ message: "Ошибка удаления закладки" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const book = readBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Книга не найдена" });
    }
    res.json(book);
  } catch (error) {
    logger.error(`book read error: ${error.message}`);
    res.status(500).json({ message: "Ошибка чтения книги" });
  }
});

module.exports = router;

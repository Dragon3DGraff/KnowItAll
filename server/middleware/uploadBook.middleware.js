const multer = require("multer");

const uploadBook = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isTxt =
      file.originalname.toLowerCase().endsWith(".txt") ||
      file.mimetype === "text/plain";

    if (isTxt) {
      cb(null, true);
      return;
    }

    cb(new Error("INVALID_FILE_TYPE"));
  },
});

module.exports = { uploadBook };

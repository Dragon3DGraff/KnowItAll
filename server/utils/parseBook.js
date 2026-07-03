const fs = require("fs");
const path = require("path");

const BOOKS_DIR = path.join(__dirname, "..", "books");

function filenameToMeta(filename) {
  const base = filename.replace(/\.txt$/i, "");
  const normalized = base.replace(/_/g, " ");
  const parts = normalized.split(/\s*[–—-]\s*/);
  if (parts.length >= 2) {
    return {
      title: parts[0].trim(),
      author: parts.slice(1).join(" – ").trim(),
    };
  }
  return { title: normalized.trim(), author: "" };
}

function getBookId(filename) {
  return encodeURIComponent(filename.replace(/\.txt$/i, ""));
}

function listBookFiles() {
  if (!fs.existsSync(BOOKS_DIR)) {
    return [];
  }
  return fs.readdirSync(BOOKS_DIR).filter((f) => f.toLowerCase().endsWith(".txt"));
}

function findFilenameById(id) {
  const decoded = decodeURIComponent(id);
  const files = listBookFiles();
  return files.find((f) => f.replace(/\.txt$/i, "") === decoded) || null;
}

const EXPLICIT_CHAPTER_RE = /^Глава\s+(\d+)\s*$/i;
const EXPLICIT_PART_RE = /^Часть\s+(\d+)\s*$/i;
const NUMBERED_CHAPTER_RE = /^(\d{1,2})$/;

function isBlankLine(lines, index) {
  return index <= 0 || lines[index - 1].trim() === "";
}

function detectExplicitChapterHeaders(lines) {
  const headers = [];

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    const chapterMatch = t.match(EXPLICIT_CHAPTER_RE);
    const partMatch = t.match(EXPLICIT_PART_RE);

    if (chapterMatch) {
      headers.push({ lineIndex: i, title: `Глава ${chapterMatch[1]}` });
    } else if (partMatch) {
      headers.push({ lineIndex: i, title: `Часть ${partMatch[1]}` });
    }
  }

  return headers;
}

function detectNumberedChapterHeaders(lines) {
  const candidates = [];

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    const match = t.match(NUMBERED_CHAPTER_RE);
    if (!match || !isBlankLine(lines, i)) {
      continue;
    }

    const num = Number(match[1]);
    if (num <= 0) {
      continue;
    }

    candidates.push({ lineIndex: i, title: `Глава ${num}`, num });
  }

  if (candidates.length < 2) {
    return [];
  }

  const headers = [];
  let expected = 1;

  for (const candidate of candidates) {
    if (candidate.num === expected) {
      headers.push(candidate);
      expected += 1;
    } else if (candidate.num > expected) {
      break;
    }
  }

  return headers.length >= 2 ? headers : [];
}

function detectChapterHeaders(lines) {
  const explicit = detectExplicitChapterHeaders(lines);
  if (explicit.length > 0) {
    return explicit;
  }

  return detectNumberedChapterHeaders(lines);
}

function linesToParagraphs(lines) {
  const paragraphs = [];
  let buffer = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (buffer.length > 0) {
        paragraphs.push(buffer.join(" ").trim());
        buffer = [];
      }
    } else {
      buffer.push(line.trim());
    }
  }

  if (buffer.length > 0) {
    paragraphs.push(buffer.join(" ").trim());
  }

  return paragraphs.filter(Boolean);
}

function parseChapters(text) {
  const lines = text.split(/\r?\n/);
  const headers = detectChapterHeaders(lines);

  if (!headers || headers.length === 0) {
    const contentLines = lines.slice(1);
    return [
      {
        index: 0,
        title: "Весь текст",
        paragraphs: linesToParagraphs(contentLines),
      },
    ];
  }

  const chapters = [];

  for (let i = 0; i < headers.length; i++) {
    const start = headers[i].lineIndex + 1;
    const end =
      i + 1 < headers.length ? headers[i + 1].lineIndex : lines.length;
    const chapterLines = lines.slice(start, end);

    chapters.push({
      index: i,
      title: headers[i].title,
      paragraphs: linesToParagraphs(chapterLines),
    });
  }

  return chapters;
}

function readBookByFilename(filename) {
  const filePath = path.join(BOOKS_DIR, filename);
  const text = fs.readFileSync(filePath, "utf-8");
  const meta = filenameToMeta(filename);
  const id = getBookId(filename);

  return {
    id,
    title: meta.title,
    author: meta.author,
    chapters: parseChapters(text),
  };
}

function listBooks() {
  return listBookFiles().map((filename) => {
    const meta = filenameToMeta(filename);
    return {
      id: getBookId(filename),
      title: meta.title,
      author: meta.author,
    };
  });
}

function readBookById(id) {
  const filename = findFilenameById(id);
  if (!filename) {
    return null;
  }
  return readBookByFilename(filename);
}

module.exports = {
  BOOKS_DIR,
  listBooks,
  readBookById,
  getBookId,
  findFilenameById,
};

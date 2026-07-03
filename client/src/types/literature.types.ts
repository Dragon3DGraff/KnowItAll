export type ViewMode = "page" | "chapter" | "scroll";

export type ReadingPosition = {
  chapterIndex: number;
  pageIndex?: number;
  scrollTop?: number;
  charIndex?: number;
};

export type BookListItem = {
  id: string;
  title: string;
  author: string;
};

export type BookChapter = {
  index: number;
  title: string;
  paragraphs: string[];
};

export type Book = {
  id: string;
  title: string;
  author: string;
  chapters: BookChapter[];
};

export type BookProgress = {
  view_mode: ViewMode;
  font_size: number;
  position: ReadingPosition;
};

export type BookBookmark = {
  id: number;
  label: string;
  position: ReadingPosition;
  created_at?: string;
};

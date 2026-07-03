import { ReadingPosition, ViewMode } from "../../types/literature.types";

export const DEFAULT_POSITION: ReadingPosition = {
  chapterIndex: 0,
  pageIndex: 0,
  scrollTop: 0,
};

export const positionLabel = (
  position: ReadingPosition,
  chapterTitle?: string,
  pageIndex?: number,
  pageCount?: number
): string => {
  const parts: string[] = [];
  if (chapterTitle) {
    parts.push(chapterTitle);
  } else if (position.chapterIndex > 0) {
    parts.push(`Глава ${position.chapterIndex + 1}`);
  }
  const page = pageIndex ?? position.pageIndex;
  if (page != null && pageCount != null && pageCount > 1) {
    parts.push(`стр. ${page + 1}`);
  }
  return parts.length > 0 ? parts.join(", ") : "Закладка";
};

export const clampChapterIndex = (index: number, chapterCount: number) =>
  Math.max(0, Math.min(index, Math.max(0, chapterCount - 1)));

export const clampPageIndex = (index: number, pageCount: number) =>
  Math.max(0, Math.min(index, Math.max(0, pageCount - 1)));

export const isValidViewMode = (mode: string): mode is ViewMode =>
  mode === "page" || mode === "chapter" || mode === "scroll";

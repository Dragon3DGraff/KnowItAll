import { useCallback, useEffect, useRef, useState } from "react";
import { addBookmark } from "../../api/addBookmark";
import { deleteBookmark } from "../../api/deleteBookmark";
import { getBook } from "../../api/getBook";
import { getBookProgress } from "../../api/getBookProgress";
import { getBookmarks } from "../../api/getBookmarks";
import { saveBookProgress } from "../../api/saveBookProgress";
import {
  Book,
  BookBookmark,
  BookProgress,
  ReadingPosition,
  ViewMode,
} from "../../types/literature.types";
import {
  DEFAULT_POSITION,
  clampChapterIndex,
  clampPageIndex,
  isValidViewMode,
  positionLabel,
} from "../utils/parsePosition";

const SAVE_DELAY_MS = 1500;

export const useBookReader = (bookId: string) => {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("scroll");
  const [fontSize, setFontSize] = useState(22);
  const [position, setPosition] = useState<ReadingPosition>(DEFAULT_POSITION);
  const [bookmarks, setBookmarks] = useState<BookBookmark[]>([]);
  const [restored, setRestored] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<Partial<BookProgress> | null>(null);
  const positionRef = useRef<ReadingPosition>(DEFAULT_POSITION);
  const viewModeRef = useRef<ViewMode>("scroll");
  const fontSizeRef = useRef(18);
  const [navToken, setNavToken] = useState(0);

  const bumpNav = useCallback(() => setNavToken((n) => n + 1), []);

  const flushSave = useCallback(
    (data: Partial<BookProgress>) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      pendingSaveRef.current = { ...pendingSaveRef.current, ...data };
      saveTimerRef.current = setTimeout(() => {
        if (pendingSaveRef.current) {
          saveBookProgress(bookId, pendingSaveRef.current);
          pendingSaveRef.current = null;
        }
      }, SAVE_DELAY_MS);
    },
    [bookId]
  );

  useEffect(() => {
    setIsLoading(true);
    setRestored(false);
    Promise.all([
      getBook(bookId),
      getBookProgress(bookId),
      getBookmarks(bookId),
    ]).then(([bookRes, progressRes, bookmarksRes]) => {
      let loadedBook: Book | null = null;
      if (!("error" in bookRes)) {
        loadedBook = bookRes;
        setBook(bookRes);
      }
      if (!("error" in progressRes)) {
        const rawPosition = progressRes.position || DEFAULT_POSITION;
        const chapterIndex =
          loadedBook != null
            ? clampChapterIndex(rawPosition.chapterIndex, loadedBook.chapters.length)
            : rawPosition.chapterIndex;
        const nextPosition = { ...rawPosition, chapterIndex };
        const nextViewMode = isValidViewMode(progressRes.view_mode)
          ? progressRes.view_mode
          : "scroll";

        setViewMode(nextViewMode);
        setFontSize(progressRes.font_size || 18);
        setPosition(nextPosition);
        positionRef.current = nextPosition;
        viewModeRef.current = nextViewMode;
        fontSizeRef.current = progressRes.font_size || 18;
      }
      if (!("error" in bookmarksRes)) {
        setBookmarks(bookmarksRes);
      }
      setIsLoading(false);
      setRestored(true);
      setNavToken((n) => n + 1);
    });

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (pendingSaveRef.current) {
        saveBookProgress(bookId, pendingSaveRef.current);
      }
    };
  }, [bookId]);

  const updatePosition = useCallback(
    (next: ReadingPosition) => {
      positionRef.current = next;
      setPosition(next);
      flushSave({
        position: next,
        view_mode: viewModeRef.current,
        font_size: fontSizeRef.current,
      });
      bumpNav();
    },
    [flushSave, bumpNav]
  );

  const changeViewMode = useCallback(
    (mode: ViewMode) => {
      viewModeRef.current = mode;
      setViewMode(mode);
      flushSave({
        view_mode: mode,
        font_size: fontSizeRef.current,
        position: positionRef.current,
      });
      bumpNav();
    },
    [flushSave, bumpNav]
  );

  const changeFontSize = useCallback(
    (size: number) => {
      const clamped = Math.max(14, Math.min(24, size));
      fontSizeRef.current = clamped;
      setFontSize(clamped);
      flushSave({
        font_size: clamped,
        view_mode: viewModeRef.current,
        position: positionRef.current,
      });
    },
    [flushSave]
  );

  const goToChapter = useCallback(
    (chapterIndex: number, pageIndex = 0) => {
      if (!book) return;
      const idx = clampChapterIndex(chapterIndex, book.chapters.length);
      updatePosition({
        chapterIndex: idx,
        pageIndex,
        scrollTop: 0,
      });
    },
    [book, updatePosition]
  );

  const goToPage = useCallback(
    (pageIndex: number, pageCount: number) => {
      updatePosition({
        ...positionRef.current,
        pageIndex: clampPageIndex(pageIndex, pageCount),
      });
    },
    [updatePosition]
  );

  const handleScroll = useCallback(
    (scrollTop: number) => {
      const next = { ...positionRef.current, scrollTop };
      positionRef.current = next;
      flushSave({
        position: next,
        view_mode: viewModeRef.current,
        font_size: fontSizeRef.current,
      });
    },
    [flushSave]
  );

  const createBookmark = useCallback(
    async (currentPosition: ReadingPosition, pageCount?: number) => {
      if (!book) return;
      const chapter = book.chapters[currentPosition.chapterIndex];
      const label = positionLabel(
        currentPosition,
        chapter?.title,
        currentPosition.pageIndex,
        pageCount
      );
      const res = await addBookmark(bookId, label, currentPosition);
      if (!("error" in res)) {
        setBookmarks((prev) => [...prev, res]);
      }
    },
    [book, bookId]
  );

  const removeBookmark = useCallback(
    async (bookmarkId: number) => {
      const res = await deleteBookmark(bookId, bookmarkId);
      if (!("error" in res)) {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      }
    },
    [bookId]
  );

  const jumpToBookmark = useCallback(
    (bookmark: BookBookmark) => {
      positionRef.current = bookmark.position;
      setPosition(bookmark.position);
      flushSave({
        position: bookmark.position,
        view_mode: viewModeRef.current,
        font_size: fontSizeRef.current,
      });
      bumpNav();
    },
    [flushSave, bumpNav]
  );

  return {
    book,
    isLoading,
    viewMode,
    fontSize,
    position,
    bookmarks,
    restored,
    navToken,
    getPosition: () => positionRef.current,
    changeViewMode,
    changeFontSize,
    updatePosition,
    goToChapter,
    goToPage,
    handleScroll,
    createBookmark,
    removeBookmark,
    jumpToBookmark,
  };
};

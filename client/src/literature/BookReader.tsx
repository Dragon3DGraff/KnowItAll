import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hourglass } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { BookmarksPanel } from "./BookmarksPanel";
import { ChapterSelect, ReaderControls } from "./ReaderControls";
import { ReaderContent } from "./ReaderContent";
import { ReaderToolbar } from "./ReaderToolbar";
import { useBookReader } from "./hooks/useBookReader";
import { usePagination } from "./hooks/usePagination";
import { paginateParagraphs } from "./utils/paginateParagraphs";

const EMPTY_PARAGRAPHS: string[] = [];

export const BookReader = () => {
  const { bookId = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [bookmarksAnchor, setBookmarksAnchor] = useState<HTMLElement | null>(
    null
  );
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const {
    book,
    isLoading,
    viewMode,
    fontSize,
    position,
    bookmarks,
    restored,
    navToken,
    getPosition,
    changeViewMode,
    changeFontSize,
    goToChapter,
    goToPage,
    handleScroll,
    createBookmark,
    removeBookmark,
    jumpToBookmark,
  } = useBookReader(bookId);

  const currentChapter = book?.chapters[position.chapterIndex];
  const chapterParagraphs = useMemo(
    () => currentChapter?.paragraphs ?? EMPTY_PARAGRAPHS,
    [currentChapter]
  );

  const { pages, pageCount } = usePagination(
    chapterParagraphs,
    fontSize,
    containerSize.width,
    containerSize.height
  );

  const currentPageIndex = Math.min(
    position.pageIndex ?? 0,
    Math.max(0, pageCount - 1)
  );
  const pageParagraphs = pages[currentPageIndex] ?? [];

  useEffect(() => {
    const el = contentAreaRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      setContainerSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height }
      );
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewMode, book]);

  const handleAddBookmark = useCallback(() => {
    const currentPosition = getPosition();
    createBookmark(
      {
        chapterIndex: currentPosition.chapterIndex,
        pageIndex: viewMode === "page" ? currentPageIndex : undefined,
        scrollTop: viewMode !== "page" ? currentPosition.scrollTop : undefined,
      },
      viewMode === "page" ? pageCount : undefined
    );
  }, [
    createBookmark,
    getPosition,
    viewMode,
    currentPageIndex,
    pageCount,
  ]);

  const handlePrev = () => {
    if (viewMode === "page") {
      if (currentPageIndex > 0) {
        goToPage(currentPageIndex - 1, pageCount);
      } else if (position.chapterIndex > 0 && book) {
        const prevChapterIndex = position.chapterIndex - 1;
        const prevPages = paginateParagraphs(
          book.chapters[prevChapterIndex].paragraphs,
          fontSize,
          containerSize.width,
          containerSize.height
        );
        goToChapter(prevChapterIndex, Math.max(0, prevPages.length - 1));
      }
    } else if (viewMode === "chapter") {
      goToChapter(position.chapterIndex - 1);
    }
  };

  const handleNext = () => {
    if (viewMode === "page") {
      if (currentPageIndex < pageCount - 1) {
        goToPage(currentPageIndex + 1, pageCount);
      } else if (book && position.chapterIndex < book.chapters.length - 1) {
        goToChapter(position.chapterIndex + 1);
      }
    } else if (viewMode === "chapter") {
      goToChapter(position.chapterIndex + 1);
    }
  };

  const hasPrev =
    viewMode === "page"
      ? currentPageIndex > 0 || position.chapterIndex > 0
      : viewMode === "chapter"
        ? position.chapterIndex > 0
        : false;

  const hasNext =
    viewMode === "page"
      ? currentPageIndex < pageCount - 1 ||
        (book ? position.chapterIndex < book.chapters.length - 1 : false)
      : viewMode === "chapter"
        ? book
          ? position.chapterIndex < book.chapters.length - 1
          : false
        : false;

  const isAtStart =
    viewMode === "page" &&
    position.chapterIndex === 0 &&
    currentPageIndex === 0;

  const handleGoToStart = () => goToChapter(0);

  const controlLabel =
    viewMode === "page"
      ? `${currentChapter?.title ?? ""}, стр. ${currentPageIndex + 1} из ${pageCount}`
      : `${currentChapter?.title ?? ""} (${position.chapterIndex + 1} из ${book?.chapters.length ?? 0})`;

  const showControls =
    viewMode === "page" || (viewMode === "chapter" && (book?.chapters.length ?? 0) > 1);

  if (!user) {
    return (
      <>
        <Typography variant="h5">Литература</Typography>
        <Typography variant="h6">
          Доступно только зарегистрированным пользователям
        </Typography>
      </>
    );
  }

  if (isLoading || !book) {
    return (
      <Hourglass
        visible={true}
        height="40"
        width="40"
        ariaLabel="hourglass-loading"
        wrapperStyle={{ margin: "auto" }}
      />
    );
  }

  return (
    <Stack
      sx={{
        textAlign: "left",
        height: "calc(100vh - 160px)",
        minHeight: 400,
        mx: -1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={1}
      >
        <Typography variant="h6" noWrap sx={{ maxWidth: "60%" }}>
          {book.title}
        </Typography>
        <Button size="small" onClick={() => navigate("/literature")}>
          К списку
        </Button>
      </Stack>

      <ReaderToolbar
        viewMode={viewMode}
        fontSize={fontSize}
        onViewModeChange={changeViewMode}
        onFontSizeChange={changeFontSize}
        onAddBookmark={handleAddBookmark}
        onOpenBookmarks={(anchor) => {
          setBookmarksAnchor(anchor);
          setBookmarksOpen(true);
        }}
        bookmarksCount={bookmarks.length}
      />

      {viewMode === "chapter" && book.chapters.length > 1 && (
        <ChapterSelect
          chapters={book.chapters}
          currentIndex={position.chapterIndex}
          onSelect={goToChapter}
        />
      )}

      {showControls && (
        <ReaderControls
          label={controlLabel}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onGoToStart={viewMode === "page" ? handleGoToStart : undefined}
          isAtStart={isAtStart}
        />
      )}

      <Box
        ref={contentAreaRef}
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          // overflow: viewMode === "page" ? "auto" : undefined,
        }}
      >
        <ReaderContent
          book={book}
          viewMode={viewMode}
          fontSize={fontSize}
          position={position}
          pageParagraphs={pageParagraphs}
          restored={restored}
          navToken={navToken}
          onScroll={handleScroll}
        />
      </Box>

      <BookmarksPanel
        open={bookmarksOpen}
        anchorEl={bookmarksAnchor}
        onClose={() => setBookmarksOpen(false)}
        bookmarks={bookmarks}
        onJump={jumpToBookmark}
        onDelete={removeBookmark}
      />
    </Stack>
  );
};

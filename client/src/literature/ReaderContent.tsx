import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { Book, ReadingPosition, ViewMode } from "../types/literature.types";

type Props = {
  book: Book;
  viewMode: ViewMode;
  fontSize: number;
  position: ReadingPosition;
  pageParagraphs: string[];
  restored: boolean;
  navToken: number;
  onScroll: (scrollTop: number) => void;
};

const readerTextSx = (fontSize: number) => ({
  textAlign: "justify" as const,
  lineHeight: 1.7,
  fontSize: `${fontSize}px`,
  maxWidth: 680,
  mx: "auto",
  px: { xs: 1, sm: 2 },
});

const paragraphSx = (fontSize: number) => ({
  mb: "1em",
  textAlign: "justify" as const,
  lineHeight: 1.7,
  fontSize: `${fontSize}px`,
});

const chapterTitleSx = (fontSize: number) => ({
  mb: 2,
  textAlign: "left" as const,
  fontSize: `${Math.round(fontSize * 1.15)}px`,
  fontWeight: 600,
});

export const ReaderContent = ({
  book,
  viewMode,
  fontSize,
  position,
  pageParagraphs,
  restored,
  navToken,
  onScroll,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!restored) return;
    const el = scrollRef.current;
    if (!el) return;
    if (viewMode !== "scroll" && viewMode !== "chapter") return;

    requestAnimationFrame(() => {
      el.scrollTop = position.scrollTop ?? 0;
    });
  }, [restored, viewMode, navToken, position.scrollTop]);

  const handleScrollEvent = () => {
    if (scrollRafRef.current != null) {
      cancelAnimationFrame(scrollRafRef.current);
    }
    scrollRafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) {
        onScroll(el.scrollTop);
      }
      scrollRafRef.current = null;
    });
  };

  if (viewMode === "page") {
    return (
      <Box
        sx={{
          ...readerTextSx(fontSize),
          overflow: "auto",
          flex: 1,
        }}
      >
        {pageParagraphs.map((p, i) => (
          <Box key={i} component="p" sx={paragraphSx(fontSize)}>
            {p}
          </Box>
        ))}
      </Box>
    );
  }

  if (viewMode === "chapter") {
    const chapter = book.chapters[position.chapterIndex];
    if (!chapter) return null;

    return (
      <Box
        ref={scrollRef}
        onScroll={handleScrollEvent}
        sx={{
          ...readerTextSx(fontSize),
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Typography component="h2" sx={chapterTitleSx(fontSize)}>
          {chapter.title}
        </Typography>
        {chapter.paragraphs.map((p, i) => (
          <Box key={i} component="p" sx={paragraphSx(fontSize)}>
            {p}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      ref={scrollRef}
      onScroll={handleScrollEvent}
      sx={{
        ...readerTextSx(fontSize),
        overflow: "auto",
        flex: 1,
        minHeight: 0,
      }}
    >
      {book.chapters.map((chapter) => (
        <Box key={chapter.index} sx={{ mb: 4 }}>
          {book.chapters.length > 1 && (
            <Typography component="h2" sx={chapterTitleSx(fontSize)}>
              {chapter.title}
            </Typography>
          )}
          {chapter.paragraphs.map((p, i) => (
            <Box key={i} component="p" sx={paragraphSx(fontSize)}>
              {p}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

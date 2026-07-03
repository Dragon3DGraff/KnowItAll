import { useEffect, useState } from "react";
import { paginateParagraphs } from "../utils/paginateParagraphs";

const pagesEqual = (a: string[][], b: string[][]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every(
    (page, i) =>
      page.length === b[i].length && page.every((p, j) => p === b[i][j])
  );
};

export const usePagination = (
  paragraphs: string[],
  fontSize: number,
  containerWidth: number,
  containerHeight: number
) => {
  const [pages, setPages] = useState<string[][]>([[]]);

  useEffect(() => {
    const next = paginateParagraphs(
      paragraphs,
      fontSize,
      containerWidth,
      containerHeight
    );
    setPages((prev) => (pagesEqual(prev, next) ? prev : next));
  }, [paragraphs, fontSize, containerWidth, containerHeight]);

  return { pages, pageCount: pages.length };
};

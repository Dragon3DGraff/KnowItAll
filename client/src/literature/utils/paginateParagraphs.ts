export const paginateParagraphs = (
  paragraphs: string[],
  fontSize: number,
  containerWidth: number,
  containerHeight: number
): string[][] => {
  if (paragraphs.length === 0) {
    return [[]];
  }

  if (containerWidth <= 0 || containerHeight <= 0) {
    return [paragraphs];
  }

  const measureRoot = document.createElement("div");
  measureRoot.style.position = "absolute";
  measureRoot.style.visibility = "hidden";
  measureRoot.style.pointerEvents = "none";
  measureRoot.style.left = "-9999px";
  measureRoot.style.top = "0";
  measureRoot.style.width = `${containerWidth}px`;
  measureRoot.style.fontSize = `${fontSize}px`;
  measureRoot.style.lineHeight = "1.7";
  measureRoot.style.textAlign = "justify";
  document.body.appendChild(measureRoot);

  const newPages: string[][] = [];
  let currentPage: string[] = [];
  let currentHeight = 0;

  const flushPage = () => {
    if (currentPage.length > 0) {
      newPages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }
  };

  for (const paragraph of paragraphs) {
    const p = document.createElement("p");
    p.style.margin = "0 0 1em 0";
    p.style.textAlign = "justify";
    p.style.lineHeight = "1.7";
    p.textContent = paragraph;
    measureRoot.appendChild(p);
    const blockHeight = p.offsetHeight;

    if (currentHeight + blockHeight > containerHeight && currentPage.length > 0) {
      measureRoot.removeChild(p);
      flushPage();
      measureRoot.appendChild(p);
      currentPage.push(paragraph);
      currentHeight = p.offsetHeight;
    } else {
      currentPage.push(paragraph);
      currentHeight += blockHeight;
    }
  }

  flushPage();
  document.body.removeChild(measureRoot);

  return newPages.length > 0 ? newPages : [paragraphs];
};

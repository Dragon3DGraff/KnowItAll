import { BookListItem } from "../types/literature.types";
import { API_URL } from "../utils/constants";

export const addBook = async (
  formData: FormData
): Promise<BookListItem | { error: string }> => {
  try {
    const res = await fetch(API_URL + "/books", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const body = await res.json();
    if (res.status === 201) {
      return body;
    }
    return { error: body.message || "Ошибка добавления книги" };
  } catch (error) {
    console.log("Ошибка добавления книги", error);
    return { error: "Ошибка добавления книги" };
  }
};

export const buildTxtFile = (
  title: string,
  author: string,
  text: string
): File => {
  const safeTitle = title.trim();
  const safeAuthor = author.trim();
  const filename = safeAuthor
    ? `${safeTitle} – ${safeAuthor}.txt`
    : `${safeTitle}.txt`
  const content = `${safeTitle}\n\n${text.trim()}`;

  return new File([content], filename, { type: "text/plain" });
};

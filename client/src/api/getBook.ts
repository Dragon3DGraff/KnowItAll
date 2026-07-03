import { Book } from "../types/literature.types";
import { API_URL } from "../utils/constants";

export const getBook = async (
  bookId: string
): Promise<Book | { error: string }> => {
  try {
    const res = await fetch(API_URL + "/books/" + encodeURIComponent(bookId), {
      credentials: "include",
    });
    if (res.status === 200) {
      return await res.json();
    }
    return { error: "Ошибка загрузки книги" };
  } catch (error) {
    console.log("Ошибка загрузки книги", error);
    return { error: "Ошибка загрузки книги" };
  }
};

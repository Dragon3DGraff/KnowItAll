import { BookProgress } from "../types/literature.types";
import { API_URL } from "../utils/constants";

export const getBookProgress = async (
  bookId: string
): Promise<BookProgress | { error: string }> => {
  try {
    const res = await fetch(
      API_URL + "/books/" + encodeURIComponent(bookId) + "/progress",
      { credentials: "include" }
    );
    if (res.status === 200) {
      return await res.json();
    }
    return { error: "Ошибка получения прогресса" };
  } catch (error) {
    console.log("Ошибка получения прогресса", error);
    return { error: "Ошибка получения прогресса" };
  }
};

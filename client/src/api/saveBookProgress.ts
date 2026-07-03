import { BookProgress } from "../types/literature.types";
import { API_URL } from "../utils/constants";

export const saveBookProgress = async (
  bookId: string,
  data: Partial<BookProgress>
): Promise<{ ok: true } | { error: string }> => {
  try {
    const res = await fetch(
      API_URL + "/books/" + encodeURIComponent(bookId) + "/progress",
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (res.status === 200) {
      return await res.json();
    }
    return { error: "Ошибка сохранения прогресса" };
  } catch (error) {
    console.log("Ошибка сохранения прогресса", error);
    return { error: "Ошибка сохранения прогресса" };
  }
};

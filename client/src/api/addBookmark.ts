import { BookBookmark, ReadingPosition } from "../types/literature.types";
import { API_URL } from "../utils/constants";

export const addBookmark = async (
  bookId: string,
  label: string,
  position: ReadingPosition
): Promise<BookBookmark | { error: string }> => {
  try {
    const res = await fetch(
      API_URL + "/books/" + encodeURIComponent(bookId) + "/bookmarks",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, position }),
      }
    );
    if (res.status === 201) {
      return await res.json();
    }
    return { error: "Ошибка создания закладки" };
  } catch (error) {
    console.log("Ошибка создания закладки", error);
    return { error: "Ошибка создания закладки" };
  }
};

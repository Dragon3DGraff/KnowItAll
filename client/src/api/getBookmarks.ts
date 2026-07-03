import { BookBookmark } from "../types/literature.types";
import { API_URL } from "../utils/constants";

export const getBookmarks = async (
  bookId: string
): Promise<BookBookmark[] | { error: string }> => {
  try {
    const res = await fetch(
      API_URL + "/books/" + encodeURIComponent(bookId) + "/bookmarks",
      { credentials: "include" }
    );
    if (res.status === 200) {
      return await res.json();
    }
    return { error: "Ошибка получения закладок" };
  } catch (error) {
    console.log("Ошибка получения закладок", error);
    return { error: "Ошибка получения закладок" };
  }
};

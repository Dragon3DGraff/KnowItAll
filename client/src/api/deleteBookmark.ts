import { API_URL } from "../utils/constants";

export const deleteBookmark = async (
  bookId: string,
  bookmarkId: number
): Promise<{ ok: true } | { error: string }> => {
  try {
    const res = await fetch(
      API_URL +
        "/books/" +
        encodeURIComponent(bookId) +
        "/bookmarks/" +
        bookmarkId,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (res.status === 200) {
      return await res.json();
    }
    return { error: "Ошибка удаления закладки" };
  } catch (error) {
    console.log("Ошибка удаления закладки", error);
    return { error: "Ошибка удаления закладки" };
  }
};

import { BookListItem } from "../types/literature.types";
import { API_URL } from "../utils/constants";

export const getBooks = async (): Promise<
  BookListItem[] | { error: string }
> => {
  try {
    const res = await fetch(API_URL + "/books", {
      credentials: "include",
    });
    if (res.status === 200) {
      return await res.json();
    }
    return { error: "Ошибка получения списка книг" };
  } catch (error) {
    console.log("Ошибка получения списка книг", error);
    return { error: "Ошибка получения списка книг" };
  }
};

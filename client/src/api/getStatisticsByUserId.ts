import { MultiplationsStatistics } from "../types/multiplication.types";
import { API_URL } from "../utils/constants";

export const getStatisticsByUserId = async (
  userId: string
): Promise<MultiplationsStatistics[] | { error: string }> => {
  try {
    const res = await fetch(API_URL + `/stat/statistics/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    });
    if (res.status === 200) {
      const body = await res.json();
      return body;
    }
    return { error: "Ошибка получения статистики" };
  } catch (error) {
    console.log("Ошибка получения статистики", error);
    return { error: "Ошибка получения статистики" };
  }
};

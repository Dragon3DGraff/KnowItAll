import { API_URL } from "../utils/constants";

export const getStatisticsAll = async () => {
  try {
    const res = await fetch(API_URL + "/stat/statistics/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    });
    if (res.ok) {
      const body = await res.json();
      return body;
    }
    return { error: "Ошибка получения админки" };
  } catch (error) {
    console.log("Ошибка получения админки", error);
    return { error: "Ошибка получения админки" };
  }
};

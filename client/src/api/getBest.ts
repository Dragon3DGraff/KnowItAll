import { API_URL } from "../utils/constants";

export const getBest = async () => {
  try {
    const res = await fetch(API_URL + "/stat/best", {
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
    return { error: "Ошибка" };
  } catch (error) {
    console.log("Ошибка", error);
    return { error: "Ошибка" };
  }
};

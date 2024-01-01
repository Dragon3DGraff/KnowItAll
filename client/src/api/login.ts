import { API_URL } from "../utils/constants";

export const login = async (data: { login: string; password: string }) => {
  try {
    const res = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify(data),
    });
    const answer = await res.json();
    if (res.status === 200) {
      return answer;
    }
    console.log("Ошибка логина", answer);
    return { error: answer };
  } catch (error) {
    console.log("Ошибка errors", error);
    return { error };
  }
};

import { API_URL } from "../utils/constants";

export const checkLogin = async (login: string) => {
  try {
    const res = await fetch(API_URL + "api/auth/checkLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login }),
    });
    if (res.status === 200) {
      const body = await res.json();
      return {isFree: body.isFree};
    }
    return { error: "Ошибка проверки логина" };
  } catch (error) {
    console.log("Ошибка проверки логина", error);
    return { error: "Ошибка проверки логина" };
  }
};

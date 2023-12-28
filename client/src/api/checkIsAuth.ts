import { API_URL } from "../utils/constants";

export const checkIsAuth = async () => {
  try {
    const res = await fetch(API_URL + "api/auth/checkAuth", {
      method: "POST",
      credentials: "include",
    });
    const answer = await res.json();
    if (res.status === 200 && answer.userName) {
      return { ok: true, userName: answer.userName };
    }
    return { ok: false };
  } catch (error) {
    console.log("Ошибка проверки логина", error);
    return { ok: false };
  }
};

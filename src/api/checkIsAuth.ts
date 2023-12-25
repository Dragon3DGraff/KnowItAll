import { API_URL } from "../utils/constants";

export const checkIsAuth = async () => {
  try {
    const res = await fetch(API_URL + "api/knowitall/checkAuth", {
      method: "POST",
    });
    if (res.status === 200) {
      const answer = await res.json();
      return { ok: true, userName: answer.userName };
    }
    return { ok: false };
  } catch (error) {
    console.log("Ошибка проверки логина", error);
    return { ok: false };
  }
};

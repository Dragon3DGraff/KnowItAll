import { API_URL } from "../utils/constants";

export const checkIsAuth = async () => {
  try {
    const res = await fetch(API_URL + "/auth/checkAuth", {
      method: "POST",
      credentials: "include",
    });
    const answer = await res.json();
    if (res.status === 200 && answer.userName) {
      return answer;
    }
    return { error: "Что-то пошло не так" };
  } catch (error) {
    console.log("Ошибка проверки логина", error);
    return { error };
  }
};

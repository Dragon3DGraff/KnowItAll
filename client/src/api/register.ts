import { RegisterData } from "../types/api.types";
import { API_URL } from "../utils/constants";

export const register = async (data: RegisterData) => {
  try {
    const res = await fetch(API_URL + "api/knowitall/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const answer = await res.json();
    if (res.status === 201) {
      return { ok: true, name: answer.userName };
    }
    console.log("Ошибка регистрации", answer);
    return { ok: false, errors: answer };
  } catch (error) {
    console.log("Ошибка регистрации", error);
    return { ok: false };
  }
};

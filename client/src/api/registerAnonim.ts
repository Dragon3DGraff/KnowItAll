import { API_URL } from "../utils/constants";

export const registerAnonim = async () => {
  try {
    const res = await fetch(API_URL + "api/auth/registerAnon", {
      method: "POST",
    });
    const answer = await res.json();
    if (res.status === 201) {
      return { ok: true, uuid: answer.uuid };
    }
    console.log("Ошибка регистрации", answer);
    return { ok: false, errors: answer };
  } catch (error) {
    console.log("Ошибка регистрации", error);
    return { ok: false };
  }
};

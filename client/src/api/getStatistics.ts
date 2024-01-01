import { StorageHelper } from "../utils/StorageHelper";
import { ANONIM_UUID, API_URL } from "../utils/constants";

export const getStatistics = async () => {
  try {
    const anonimUUID = StorageHelper.get(ANONIM_UUID);

    const res = await fetch(API_URL + "api/stat/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ uuid: anonimUUID }),
    });
    if (res.status === 200) {
      const body = await res.json();
      return body.data;
    }
    return { error: "Ошибка проверки логина" };
  } catch (error) {
    console.log("Ошибка проверки логина", error);
    return { error: "Ошибка проверки логина" };
  }
};

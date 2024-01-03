import { MultiplationsStatistics } from "../types/multiplication.types";
import { StorageHelper } from "../utils/StorageHelper";
import { ANONIM_UUID, API_URL } from "../utils/constants";

export const getStatistics = async (): Promise<
  MultiplationsStatistics[] | { error: string }
> => {
  try {
    const anonimUUID = StorageHelper.get(ANONIM_UUID);

    const res = await fetch(API_URL + "/stat/statistics", {
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
    return { error: "Ошибка получения статистики" };
  } catch (error) {
    console.log("Ошибка получения статистики", error);
    return { error: "Ошибка получения статистики" };
  }
};

import { Mode, Result } from "../types/multiplication.types";
import { StorageHelper } from "../utils/StorageHelper";
import { ANONIM_UUID, API_URL } from "../utils/constants";

export const sendResults = async (
  timer: number,
  results: Result[],
  mode: Mode,
  userName?: string
) => {
  try {
    const data: {
      timer: number;
      results: Result[];
      mode: Mode;
      uuid?: string;
    } = {
      timer,
      results,
      mode,
    };
    if (!userName) {
      const anonimUUID = StorageHelper.get(ANONIM_UUID);
      if (anonimUUID) {
        data.uuid = anonimUUID;
      }
    }
   const res = await fetch(API_URL + "/data/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify(data),
    });

    const answer = await res.json();
    if(res.status === 201){
      return { ok: true, id: answer.id };
    }

    return { ok: false, errors: answer };
  } catch (error) {
    console.log(error);
  }
};

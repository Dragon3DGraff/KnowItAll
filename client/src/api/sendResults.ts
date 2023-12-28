import { Mode, Result } from "../types/multiplication.types";
import { API_URL } from "../utils/constants";

export const sendResults = async (
  timer: number,
  results: Result[],
  mode: Mode
) => {
  try {
    await fetch(API_URL + "api/data/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        timer,
        results,
        mode,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

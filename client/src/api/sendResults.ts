import { Result } from "../types/multiplication.types";
import { API_URL } from "../utils/constants";

export const sendResults = async (timer: number, results: Result[]) => {
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
        mode: "exam", //TODO хардкод!!!
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

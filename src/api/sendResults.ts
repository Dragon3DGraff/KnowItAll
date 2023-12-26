import { Result } from "../types/multiplication.types";
import { API_URL } from "../utils/constants";

export const sendResults = async (timer: number, results: Result[]) => {
  try {
    await fetch(API_URL + "api/knowitall/resuts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        timer,
        results,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

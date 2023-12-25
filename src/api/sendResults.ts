import { Result } from "../types/multiplication.types";
import { API_URL } from "../utils/constants";

export const sendResults = async (timer: number, results: Result[], userName: string) => {
  try {
    await fetch(API_URL + "api/knowitall/resuts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        timer,
        userName,
        results,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

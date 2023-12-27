import { API_URL } from "../utils/constants";

export const logout = async () => {
  try {
    await fetch(API_URL + "api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

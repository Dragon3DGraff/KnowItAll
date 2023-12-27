export const USER_NAME_KEY = "knowItAll_userName";

export const SELECTED_NUMBERS = "knowItAll_selectedNumbers";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "/"
    : "http://127.0.0.1:5000/";

export const TIMER_STEPS = {
  four: 90,
  three: 120,
  end: 180,
};

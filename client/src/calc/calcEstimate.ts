import { TIMER_STEPS } from "../utils/constants";

export const calcEstimate = (
  correctCount: number,
  totalCount: number,
  timer?: number
) => {
  const percent = correctCount / totalCount;

  let start = 0;

  if (timer) {
    if (timer > TIMER_STEPS.four && timer < TIMER_STEPS.three) {
      start = -1;
    }

    if (timer >= TIMER_STEPS.three && timer < TIMER_STEPS.end) {
      start = -2;
    }

    if (timer >= 180) {
      start = -3;
    }
  }

  if (percent <= 0.49) {
    return 2;
  }
  if (percent >= 0.9) {
    return start + 5;
  }
  if (percent >= 0.66 && percent < 0.9) {
    return start + 4;
  }
  if (percent > 0.49 && percent < 0.66) {
    return start + 3;
  }
  return null;
};

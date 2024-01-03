import { Stack, Typography } from "@mui/material";
import { Timer } from "./Timer";
import { Mode } from "../types/multiplication.types";

type Props = {
  started: boolean;
  finished: boolean;
  mode: Mode;
  onFinish: (timer: number) => void;
  onTimerStop: () => void;
};
export const Header = ({
  started,
  finished,
  onFinish,
  onTimerStop,
  mode,
}: Props) => {
  return (
    <Stack>
      <Typography variant="h5">Таблица умножения</Typography>
      {started && (
        <Timer
          started={started}
          finished={finished}
          mode={mode}
          onFinish={onFinish}
          onTimerStop={onTimerStop}
        />
      )}
    </Stack>
  );
};

import { Stack, Typography } from "@mui/material";
import { Timer } from "./Timer";
import { Mode } from "../types/multiplication.types";

type Props = {
  started: boolean;
  finished: boolean;
  onFinish: (timer: number) => void;
  mode: Mode;
};
export const Header = ({ started, finished, onFinish, mode }: Props) => {
  return (
    <Stack>
      <Typography variant="h5">Таблица умножения</Typography>
      {started && (
        <Timer
          started={started}
          finished={finished}
          onFinish={onFinish}
          mode={mode}
        />
      )}
    </Stack>
  );
};

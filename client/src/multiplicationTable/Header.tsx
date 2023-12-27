import { Stack, Typography } from "@mui/material";
import { Timer } from "./Timer";

type Props = {
  started: boolean;
  finished: boolean;
  onFinish: (timer: number) => void;
};
export const Header = ({ started, finished, onFinish }: Props) => {
  return (
    <Stack>
      <Typography variant="h4">Таблица умножения</Typography>
      {started && (
        <Timer started={started} finished={finished} onFinish={onFinish} />
      )}
    </Stack>
  );
};

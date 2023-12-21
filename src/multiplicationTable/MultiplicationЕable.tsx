import { useEffect } from "react";
import { getTable } from "../calc/getMultiplicationTable";
import { Box, Stack, Typography } from "@mui/material";


export const MultiplicationЕable = () => {
  useEffect(() => {
    console.log(getTable());
  }, []);
  return (
    <Stack>
      <Typography>Таблица умножения</Typography>
      <Box>{JSON.stringify(getTable(), null, " ")}</Box>
    </Stack>
  );
};

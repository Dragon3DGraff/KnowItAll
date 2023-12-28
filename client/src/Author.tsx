import { Stack, Typography } from "@mui/material";

export const Author = () => {
  return (
    <Stack padding={2} width={"100%"} mt={"auto"}>
      <Typography variant="caption" color="#778899">
        Автор: Денисов &#171;Dragon3DGraff&#187; Илья
      </Typography>
      <Typography variant="caption">2024</Typography>
    </Stack>
  );
};

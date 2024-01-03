import { Box, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError() as { statusText: string; message: string };
  console.error(error);

  return (
    <Box id="error-page" mx="auto" p={3}>
      <Typography variant="h3">Ой!</Typography>
      <Typography>Случилась какая-то ошибка!</Typography>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Box>
  );
};

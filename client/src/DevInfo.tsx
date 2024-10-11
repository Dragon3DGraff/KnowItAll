import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { createPortal } from "react-dom";

export const DevInfo = () => {
  const isDev =
    location.hostname === "localhost" ||
    location.hostname === "know-it-all.store";

  if (!isDev) return null;

  return createPortal(
    <Box position={"absolute"} left={"0"} bottom={0} color={"#FFE4E1"} p={2}>
      <Typography variant="h3">DEV</Typography>
    </Box>,
    document.body
  );
};

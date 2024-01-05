import { Link, Stack, Typography } from "@mui/material";
import { Info } from "./Info";

export const Author = () => {
  const data = new Date();
  return (
    <Stack padding={2} mt={"auto"} mx={"auto"} alignItems={"center"}>
      <Info />
      <Typography variant="caption" color="#778899">
        Автор: Денисов &#171;
        <Link
          href="https://github.com/Dragon3DGraff/KnowItAll"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dragon3DGraff
        </Link>
        &#187; Илья
      </Typography>
      <Typography variant="caption">{data.getFullYear() + "г."}</Typography>
    </Stack>
  );
};

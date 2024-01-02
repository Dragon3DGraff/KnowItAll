import { Link, Stack, Typography } from "@mui/material";

export const Author = () => {
  return (
    <Stack padding={2} mt={"auto"} mx={"auto"} alignItems={'center'}>
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
      <Typography variant="caption">2024</Typography>
    </Stack>
  );
};

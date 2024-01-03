import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getStatisticsAll } from "../api/getStatisticsAll";
import { useUser } from "../hooks/useUser";

export const AdminPanel = () => {
  const { user, isAdmin } = useUser();

  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    user &&
      isAdmin &&
      getStatisticsAll().then((res) => {
        setResults(res);
      });
  }, [user, isAdmin]);

  if (!user) {
    return null;
  }

  return (
    <Stack>
      <Typography variant="h5">Админка</Typography>
      {results &&
        Object.entries(results).map(([key, val]) => (
          <Stack key={key} direction={"row"} gap={4}>
            <Typography>{key}</Typography>
            <Typography>{val}</Typography>
          </Stack>
        ))}
    </Stack>
  );
};

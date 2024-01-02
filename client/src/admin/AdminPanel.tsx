import { Stack, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { getStatisticsAll } from "../api/getStatisticsAll";
import { Role } from "../types/api.types";

export const AdminPanel = () => {
  const user = useContext(UserContext);

  const navigate = useNavigate();
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    user &&
      user.role === Role.ADMIN &&
      getStatisticsAll().then((res) => {
        setResults(res);
      });
  }, [user]);

  if (!user) {
    return null;
  }

  console.log(results);
  return (
    <Stack>
      <Button
        onClick={() => navigate("/")}
        sx={{ maxWidth: "fit-content" }}
        variant="contained"
      >
        Домой
      </Button>
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

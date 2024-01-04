import { useEffect, useState } from "react";
import { getStatistics } from "../api/getStatistics";
import { MultiplationsStatistics } from "../types/multiplication.types";

import Typography from "@mui/material/Typography";
import { Hourglass } from "react-loader-spinner";
import { useUser } from "../hooks/useUser";
import { StatisticTable } from "./StatisticTable";
import { Stack } from "@mui/material";

export const Statistics = () => {
  const { user } = useUser();

  const [results, setResults] = useState<MultiplationsStatistics[]>([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setisLoading(true);
      getStatistics()
        .then((res) => {
          if (!("error" in res)) {
            setResults(res);
          }
        })
        .finally(() => {
          setisLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <Typography variant="h5">Статистика</Typography>
        <Typography variant="h6">
          Доступно только зарегистрированным пользователям
        </Typography>
      </>
    );
  }

  if (isLoading) {
    return (
      <Hourglass
        visible={true}
        height="40"
        width="40"
        ariaLabel="hourglass-loading"
        wrapperStyle={{ margin: "auto" }}
        wrapperClass=""
        colors={["#306cce", "#72a1ed"]}
      />
    );
  }

  return (
    <Stack>
      <Typography variant="h5">Статистика</Typography>
      <StatisticTable results={results} />;
    </Stack>
  );
};

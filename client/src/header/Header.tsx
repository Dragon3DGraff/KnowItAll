import { Box, Button, Stack } from "@mui/material";
import { Statistics } from "./Statistics";
import { useContext, useEffect, useState } from "react";
import { checkIsAuth } from "../api/checkIsAuth";
import { UserContext } from "../App";
import { UserName } from "../user/UserName";

type Props = {
  onNameChanged: (userName?: string) => void;
};
export const Header = ({ onNameChanged }: Props) => {
  const [statisticsTitle, setStatisticsTitle] = useState("");
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user?.userName) {
      checkIsAuth().then((res) => {
        if (res.ok) {
          onNameChanged(res.userName);
        }
      });
    }
  }, []);

  return (
    <Stack
      direction={"row"}
      width={"100vw"}
      justifyContent={"space-between"}
      minWidth={" 400px"}
    >
      <Box px={3}>
        <Button onClick={() => setStatisticsTitle("Достижения")}>
          Достижения
        </Button>
        {/* <Button onClick={() => setStatisticsTitle("Статистика")}>
          Статистика
        </Button> */}
        <Button onClick={() => setStatisticsTitle("Награды")}>Награды</Button>
      </Box>
      <UserName onNameChanged={onNameChanged} />
      <Statistics
        open={Boolean(statisticsTitle)}
        onClose={() => setStatisticsTitle("")}
        title={statisticsTitle}
      />
    </Stack>
  );
};

import { Box, Button, Stack } from "@mui/material";
import { Statistics } from "./Statistics";
import { useContext, useEffect, useState } from "react";
import { checkIsAuth } from "../api/checkIsAuth";
import { UserContext } from "../App";
import { UserName } from "../user/UserName";
import { setAnonimId } from "../api/setAnonimId";
import { User } from "../types/api.types";

type Props = {
  onNameChanged: (user: User | null) => void;
};
export const Header = ({ onNameChanged }: Props) => {
  const [statisticsTitle, setStatisticsTitle] = useState("");
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user?.userName) {
      checkIsAuth().then((res) => {
        if (!res.error) {
          onNameChanged(res);
        } else {
          setAnonimId();
        }
      });
    }
  }, []);

  return (
    <Stack
      direction={"row"}
      width={"100vw"}
      justifyContent={"space-between"}
      minWidth={"250px"}
    >
      <Box px={3}>
        <Button onClick={() => setStatisticsTitle("Достижения")}>
          Достижения
        </Button>
        {/* <Button onClick={() => setStatisticsTitle("Статистика")}>
          Статистика
        </Button> */}
        {/* <Button onClick={() => setStatisticsTitle("Награды")}>Награды</Button> */}
      </Box>
      <UserName onNameChanged={onNameChanged} />
      {statisticsTitle && (
        <Statistics
          open={Boolean(statisticsTitle)}
          onClose={() => setStatisticsTitle("")}
          title={statisticsTitle}
        />
      )}
    </Stack>
  );
};

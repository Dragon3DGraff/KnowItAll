import { Stack, Typography, Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Registration } from "./Registration";
import { Login } from "./Login";
import { Statistics } from "./Statistics";

type Props = {
  onNameChanged: (userName?: string) => void;
};
export const UserName = ({ onNameChanged }: Props) => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [statisticsTitle, setStatisticsTitle] = useState("");
  const user = useContext(UserContext);

  const onDeleteName = async () => {
    // await logout() //TODO
    onNameChanged(undefined);
  };

  const onRegistrationClose = () => {
    setIsRegistrationOpen(false);
  };

  const onLogin = (name: string) => {
    onNameChanged(name);
  };

  const onLoginOpen = () => {
    setIsLoginOpen(true);
  };

  const onLoginClose = () => {
    setIsLoginOpen(false);
  };

  return (
    <Stack position={"absolute"} right={30} top={5} mb={1}>
      <Stack
        direction={"row"}
        alignItems={"self-start"}
        justifyContent={"center"}
      >
        {user?.userName ? (
          <Stack direction={"row"} alignItems={"center"}>
            <Typography color={"green"} variant="h6">
              Привет, {user?.userName}!
            </Typography>
            <Box ml={3}>
              <Button
                variant="text"
                size="small"
                sx={{ fontSize: "11px" }}
                onClick={onDeleteName}
              >
                Выйти
              </Button>
            </Box>
          </Stack>
        ) : (
          <Stack direction={"row"}>
            <Button onClick={onLoginOpen}>Войти</Button>
            <Button onClick={() => setIsRegistrationOpen(true)}>
              Регистрация
            </Button>
          </Stack>
        )}
      </Stack>
      <Registration
        open={isRegistrationOpen}
        onClose={onRegistrationClose}
        onLogin={onLogin}
      />
      <Login open={isLoginOpen} onClose={onLoginClose} onLogin={onLogin} />
      <Button onClick={() => setStatisticsTitle("Достижения")}>
        Достижения
      </Button>
      <Button onClick={() => setStatisticsTitle("Статистика")}>
        Статистика
      </Button>
      <Button onClick={() => setStatisticsTitle("Награды")}>Награды</Button>
      <Statistics
        open={Boolean(statisticsTitle)}
        onClose={() => setStatisticsTitle("")}
        onLogin={onLoginOpen}
        onRegister={() => setIsRegistrationOpen(true)}
        title={statisticsTitle}
      />
    </Stack>
  );
};

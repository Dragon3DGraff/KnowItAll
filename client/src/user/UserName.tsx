import { Typography, Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Registration } from "./Registration";
import { Login } from "./Login";
import { logout } from "../api/logout";
import { AuthMenu } from "./AuthMenu";
import { User } from "../types/api.types";

type Props = {
  onNameChanged: (user: User | null) => void;
};
export const UserName = ({ onNameChanged }: Props) => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const user = useContext(UserContext);

  const onDeleteName = async () => {
    await logout();
    onNameChanged(null);
  };

  const onRegistrationClose = () => {
    setIsRegistrationOpen(false);
  };

  const onLogin = (user: User) => {
    onNameChanged(user);
  };

  const onLoginOpen = () => {
    setIsLoginOpen(true);
  };

  const onLoginClose = () => {
    setIsLoginOpen(false);
  };

  return (
    <>
      {user?.userName ? (
        <Box pr={2}>
          <Box>
            <Typography color={"green"} variant="h6">
              Привет, {user.userName}!
            </Typography>
          </Box>

          <Box ml={3}>
            <Button
              variant="text"
              size="small"
              sx={{ fontSize: "10px", p: 0 }}
              onClick={onDeleteName}
            >
              Выйти
            </Button>
          </Box>
        </Box>
      ) : (
        <Box px={2}>
          <AuthMenu
            onLoginOpen={onLoginOpen}
            onRegistrationOpen={() => setIsRegistrationOpen(true)}
          />
        </Box>
      )}

      <Registration
        open={isRegistrationOpen}
        onClose={onRegistrationClose}
        onLogin={onLogin}
        onLoginError={onLoginOpen}
      />
      <Login open={isLoginOpen} onClose={onLoginClose} onLogin={onLogin} />
    </>
  );
};

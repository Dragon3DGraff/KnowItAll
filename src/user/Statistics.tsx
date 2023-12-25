import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../App";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  title: string;
};

export const Statistics = ({
  open,
  onClose,
  onRegister,
  onLogin,
  title,
}: Props) => {
  const user = useContext(UserContext);

  const onRegisterHandler = () => {
    onRegister();
    onClose();
  };
  const onLoginHandler = () => {
    onLogin();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {user?.userName
          ? `Скоро здесь появится ${title}`
          : `Доступно только для зарегистрированных пользователей`}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontSize: "11px" }} color="secondary">
          Закрыть
        </Button>
        {!user?.userName && (
          <>
            <Button onClick={onRegisterHandler}>Зарегистрироваться</Button>
            <Button onClick={onLoginHandler}>Войти</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

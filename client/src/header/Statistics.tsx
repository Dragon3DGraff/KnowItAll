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

  title: string;
};

export const Statistics = ({
  open,
  onClose,

  title,
}: Props) => {
  const user = useContext(UserContext);

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
      </DialogActions>
    </Dialog>
  );
};

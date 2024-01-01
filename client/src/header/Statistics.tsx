import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { getStatistics } from "../api/getStatistics";

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

  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {user
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

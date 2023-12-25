import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { LoginData } from "../types/api.types";

import { login } from "../api/login";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
};
export const Login = ({ open, onClose, onLogin }: Props) => {
  const [form, setForm] = useState<LoginData>({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginData>({
    login: "",
    password: "",
  });

  const onInputChange = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = async () => {
    const res = await login(form);
    if (res.ok) {
      onLogin(res.userName);
      onClose();
    } else {
      const errors = res.errors?.errors;
      errors && setErrors((prev) => ({ ...prev, ...errors }));
    }
  };

  const isFIlled = form.login && form.password;

  const isButtonDisabled = !isFIlled;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Регистрация</DialogTitle>
      <DialogContent>
        <form id="registration">
          <Stack gap={1}>
            <Typography minWidth={"100px"}>Логин</Typography>
            <TextField
              size="small"
              onChange={onInputChange}
              name={"login"}
              error={Boolean(errors.login)}
              helperText={errors.login}
            />
            <Typography minWidth={"100px"}>Пароль</Typography>
            <TextField
              size="small"
              onChange={onInputChange}
              name={"password"}
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontSize: "11px" }} color="secondary">
          Отмена
        </Button>
        {
          <Button
            onClick={onSubmit}
            sx={{ fontSize: "11px" }}
            disabled={isButtonDisabled}
          >
            Войти
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
};

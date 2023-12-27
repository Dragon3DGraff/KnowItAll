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
import { RegisterData } from "../types/api.types";
import { register } from "../api/register";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { checkLogin } from "../api/checkLogin";
import { login } from "../api/login";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
};
export const Registration = ({ open, onClose, onLogin }: Props) => {
  const [form, setForm] = useState<RegisterData>({
    userName: "",
    login: "",
    password: "",
    birthdate: "",
  });

  const [errors, setErrors] = useState<RegisterData>({
    userName: "",
    login: "",
    password: "",
    birthdate: "",
  });

  const onInputChange = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onRegister = async () => {
    const res = await register(form);
    if (res.ok) {
      const loginInfo = await login({
        login: form.login,
        password: form.password,
      });
      if (loginInfo.ok) {
        onLogin(loginInfo.userName);
        onClose();
      }
    } else {
      const errors = res.errors;
      setErrors((prev) => ({ ...prev, ...errors }));
    }
  };

  const onBlur = async (e: { target: { value: string } }) => {
    const isLoginFree = await checkLogin(e.target.value); // TODO
    if (!isLoginFree.error && !isLoginFree.isFree) {
      setErrors((prev) => ({ ...prev, login: "Этот логин уже занят" }));
    }
  };

  const onDateChage = (value: string | null) => {
    form.birthdate = value ?? "";
  };

  const isFIlled = form.userName && form.login && form.password;
  const isShotPassword = Boolean(form.password && form.password.length < 7);

  const isButtonDisabled = !(isFIlled && form.password.length > 6);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Регистрация</DialogTitle>
      <DialogContent>
        <form id="registration">
          <Stack gap={1}>
            <Typography minWidth={"100px"}>Имя</Typography>
            <TextField
              size="small"
              onChange={onInputChange}
              name={"userName"}
            />
            <Typography minWidth={"100px"}>День рождения</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker label="Basic date picker" onChange={onDateChage} />
              </DemoContainer>
            </LocalizationProvider>

            <Typography minWidth={"100px"}>Логин</Typography>
            <TextField
              size="small"
              onChange={onInputChange}
              name={"login"}
              onBlur={onBlur}
              error={Boolean(errors.login)}
              helperText={errors.login}
            />
            <Typography minWidth={"100px"}>Пароль</Typography>
            <TextField
              size="small"
              onChange={onInputChange}
              name={"password"}
              type="password"
              error={isShotPassword}
              helperText={isShotPassword ? "Слишком короткий пароль" : " "}
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
            onClick={onRegister}
            sx={{ fontSize: "11px" }}
            disabled={isButtonDisabled}
          >
            Зарегистрироваться
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
};

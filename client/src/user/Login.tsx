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
import { LoginData, User } from "../types/api.types";

import { login } from "../api/login";
import { Hourglass } from "react-loader-spinner";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
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

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const onInputChange = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onPasswordChange = (e: { target: { value: string } }) => {
    setForm((prev) => ({ ...prev, password: e.target.value }));
    setErrors((prev) => ({ ...prev, ["password"]: "" }));
  };

  const onCloseHandler = () => {
    setErrors({
      login: "",
      password: "",
    });
    setForm({
      login: "",
      password: "",
    });
    setError("");
    onClose();
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await login(form);
    setIsLoading(false);

    if (!res.error) {
      onLogin(res);
      onCloseHandler();
    } else {
      const errors = res.error?.errors;
      errors && setErrors((prev) => ({ ...prev, ...errors }));
      setError("Ой, что-то пошло не так...");
    }
  };

  const isFIlled = form.login && form.password;

  const isButtonDisabled = !isFIlled;

  return (
    <Dialog open={open} onClose={onCloseHandler} maxWidth="md">
      <DialogTitle>
        <Stack direction={"row"} alignItems={"center"}>
          Вход
          {isLoading && (
            <Hourglass
              visible={true}
              height="20"
              width="20"
              ariaLabel="hourglass-loading"
              wrapperStyle={{ margin: "auto" }}
              wrapperClass=""
              colors={["#306cce", "#72a1ed"]}
            />
          )}
        </Stack>
        {error && <Typography color={"red"}>{error}</Typography>}
      </DialogTitle>

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
              onChange={onPasswordChange}
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseHandler}
          sx={{ fontSize: "11px" }}
          color="secondary"
        >
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

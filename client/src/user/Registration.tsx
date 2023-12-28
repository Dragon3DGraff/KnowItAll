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
import { checkLogin } from "../api/checkLogin";
import { login } from "../api/login";
import { Hourglass } from "react-loader-spinner";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
  onLoginError: () => void;
};
export const Registration = ({
  open,
  onClose,
  onLogin,
  onLoginError,
}: Props) => {
  const [form, setForm] = useState<RegisterData>({
    userName: "",
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState<RegisterData>({
    userName: "",
    login: "",
    password: "",
  });

  const [error, setError] = useState<string>();
  const [loginEror, setLoginError] = useState<boolean>();
  const [isRegistered, setIsRegistered] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const onInputChange = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onRegister = async () => {
    setIsLoading(true);
    const res = await register(form);
    setIsLoading(false);
    if (res.ok) {
      setIsRegistered(true);
      const loginInfo = await login({
        login: form.login,
        password: form.password,
      });

      onCloseHandler();

      if (loginInfo.ok) {
        onLogin(loginInfo.userName);
      } else {
        setLoginError(true);
      }
    } else {
      const errors = res.errors;
      setErrors((prev) => ({ ...prev, ...errors }));
      setError("Ой, что-то пошло не так...");
    }
  };

  const onCloseHandler = () => {
    setErrors({
      userName: "",
      login: "",
      password: "",
    });
    setError("");
    setForm({
      userName: "",
      login: "",
      password: "",
    });
    onClose();
  };

  const onBlur = async (e: { target: { value: string } }) => {
    const isLoginFree = await checkLogin(e.target.value); // TODO
    if (!isLoginFree.error && !isLoginFree.isFree) {
      setErrors((prev) => ({ ...prev, login: "Этот логин уже занят" }));
    }
  };

  const onSuccess = () => {
    if (loginEror) {
      onLoginError();
    }
    onCloseHandler();
  };

  const isFIlled = form.userName && form.login && form.password;
  const isShotPassword = Boolean(form.password && form.password.length < 7);

  const isButtonDisabled = !(isFIlled && form.password.length > 6);

  return (
    <Dialog open={open} onClose={onCloseHandler} maxWidth="md">
      <DialogTitle>
        <Stack direction={"row"} alignItems={"center"}>
          Регистрация
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
        {isRegistered ? (
          <Typography variant="h5" m={8}>
            Успешно!
          </Typography>
        ) : (
          <form id="registration">
            <Stack gap={1}>
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
              <Typography minWidth={"100px"}>Имя</Typography>
              <TextField
                size="small"
                onChange={onInputChange}
                name={"userName"}
              />
            </Stack>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        {isRegistered ? (
          <>
            <Button onClick={onSuccess}>Закрыть</Button>
          </>
        ) : (
          <>
            <Button
              onClick={onCloseHandler}
              sx={{ fontSize: "11px" }}
              color="secondary"
            >
              Отмена
            </Button>

            <Button
              onClick={onRegister}
              sx={{ fontSize: "11px" }}
              disabled={isButtonDisabled}
            >
              <span>Зарегистрироваться</span>
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

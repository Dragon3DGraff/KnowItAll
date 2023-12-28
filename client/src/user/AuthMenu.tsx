import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type Props = {
  onLoginOpen: () => void;
  onRegistrationOpen: () => void;
};
export const AuthMenu = ({ onLoginOpen, onRegistrationOpen }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onLoginOpenHandler = () => {
    onLoginOpen();
    setAnchorEl(null);
  };
  const onRegistrationOpenHandler = () => {
    onRegistrationOpen();
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Вход
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={onLoginOpenHandler}>
          Есть логин и пароль
        </MenuItem>
        <MenuItem onClick={onRegistrationOpenHandler}>
          Зарегистрироваться
        </MenuItem>
      </Menu>
    </div>
  );
};

import { Box, Button, Stack } from "@mui/material";
import { useContext, useEffect } from "react";
import { checkIsAuth } from "../api/checkIsAuth";
import { UserContext } from "../App";
import { UserName } from "../user/UserName";
import { setAnonimId } from "../api/setAnonimId";
import { Role, User } from "../types/api.types";
import { useNavigate } from "react-router-dom";

type Props = {
  onNameChanged: (user: User | null) => void;
};
export const Header = ({ onNameChanged }: Props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userName) {
      checkIsAuth().then((res) => {
        if (!res.error) {
          onNameChanged(res);
        } else {
          setAnonimId();
        }
      });
    }
  }, []);

  return (
    <Stack
      direction={"row"}
      width={"100vw"}
      justifyContent={"space-between"}
      minWidth={"250px"}
    >
      <Box px={3}>
        <Button onClick={() => navigate("/statistics")}>Достижения</Button>
        {user?.role === Role.ADMIN && (
          <Button onClick={() => navigate("/admin")}>Админка</Button>
        )}
      </Box>
      <UserName onNameChanged={onNameChanged} />
    </Stack>
  );
};

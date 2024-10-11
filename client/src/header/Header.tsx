import { Box, Button, Stack } from "@mui/material";
import { useEffect } from "react";
import { checkIsAuth } from "../api/checkIsAuth";
import { UserName } from "../user/UserName";
import { setAnonimId } from "../api/setAnonimId";
import { User } from "../types/api.types";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "../hooks/useUser";

type Props = {
  onNameChanged: (user: User | null) => void;
};
export const Header = ({ onNameChanged }: Props) => {
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

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
        {location.pathname !== "/" ? (
          <Button onClick={() => navigate("/")}>
            <ArrowBackIcon sx={{ mr: 1 }} />
            Решать
          </Button>
        ) : (
          <Button onClick={() => navigate("/statistics")}>Достижения</Button>
        )}
        {isAdmin && <Button onClick={() => navigate("/admin")}>Админка</Button>}
        {isAdmin && <Button onClick={()=> navigate('/game')}>Игра</Button>}
      </Box>
      <UserName onNameChanged={onNameChanged} />
    </Stack>
  );
};

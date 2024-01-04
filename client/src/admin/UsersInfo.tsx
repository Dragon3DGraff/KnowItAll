import { AdminInfo } from "../types/api.types";
import { Box, Stack, Typography } from "@mui/material";
import { UsersTable } from "./UsersTable";

type Props = {
  info: AdminInfo;
};

export const UsersInfo = ({ info }: Props) => {
  const users = info?.usersList;

  if (!users) {
    return (
      <Box p={2}>
        <Typography>Нет пользователей</Typography>;
      </Box>
    );
  }

  return (
    <Stack>
      <Box p={2}>
        <Typography>
          Количество зарегистрированных пользователей: {users.length}
        </Typography>
      </Box>
      <UsersTable users={users} />
    </Stack>
  );
};

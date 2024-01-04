import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { AdminInfo } from "../types/api.types";
import { UsersTable } from "./UsersTable";
import { useEffect, useState } from "react";
import { getStatisticsByUserId } from "../api/getStatisticsByUserId";
import { MultiplationsStatistics } from "../types/multiplication.types";
import { Hourglass } from "react-loader-spinner";
import { StatisticTable } from "../multiplicationTable/StatisticTable";

type Props = {
  info: AdminInfo;
};
export const AnonimInfo = ({ info }: Props) => {
  const users = info?.anonList;

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [results, setResults] = useState<MultiplationsStatistics[]>([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setisLoading(true);
      getStatisticsByUserId(selectedUser)
        .then((res) => {
          if (!("error" in res)) {
            setResults(res);
          }
        })
        .finally(() => {
          setisLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [selectedUser]);

  const onRowClick = (id: number) => {
    setSelectedUser(String(id));
  };

  const onDialogClose = () => {
    setSelectedUser(null);
  };

  if (!users) {
    return (
      <Box p={2}>
        <Typography>Нет анонимов</Typography>;
      </Box>
    );
  }

  const anonList = [...users.sort((a, b) => (b.solved ?? 0) - (a.solved ?? 0))];

  return (
    <Stack>
      <Box p={2}>
        <Typography>Анонимных пользователей: {anonList.length}</Typography>
      </Box>

      <UsersTable users={anonList} onRowClick={onRowClick} />
      <Dialog
        open={Boolean(selectedUser)}
        onClose={onDialogClose}
        maxWidth="lg"
      >
        <DialogContent>
          {isLoading ? (
            <Stack
              width={"30vw"}
              height={"30vh"}
              textAlign={"center"}
              justifyContent={"center"}
            >
              <Hourglass
                visible={true}
                height="40"
                width="40"
                ariaLabel="hourglass-loading"
                wrapperStyle={{ margin: "auto" }}
                wrapperClass=""
                colors={["#306cce", "#72a1ed"]}
              />
            </Stack>
          ) : (
            <StatisticTable results={results} />
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onDialogClose}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

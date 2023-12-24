import { Box, Button, Input, Stack, Typography } from "@mui/material";
import "./App.css";
import { MultiplicationTableSolve } from "./multiplicationTable/MultiplicationTable";
import { getTable } from "./calc/getMultiplicationTable";
import { StorageHelper } from "./utils/StorageHelper";
import { USER_NAME_KEY } from "./utils/constants";
import { useState } from "react";

function App() {
  const [savedUserName, setSavedUserName] = useState<string>(
    StorageHelper.get(USER_NAME_KEY) ?? ""
  );

  const [userName, setUserName] = useState<string>(
    StorageHelper.get(USER_NAME_KEY) ?? ""
  );
  const onInputChange = (e: { target: { value: string } }) => {
    setUserName(e.target.value);
  };
  const onSaveClick = () => {
    if (userName) {
      StorageHelper.save(USER_NAME_KEY, userName);
      setSavedUserName(userName);
    }
  };
  const onDeleteName = () => {
    setUserName("");
    setSavedUserName("");
    StorageHelper.delete(USER_NAME_KEY);
  };

  return (
    <>
      <Stack maxWidth="700px">
        <Stack
          position={"absolute"}
          right={30}
          top={10}
          direction={"row"}
          alignItems={"self-start"}
          mb={1}
          justifyContent={"center"}
        >
          {savedUserName ? (
            <>
              <Typography color={"green"} variant="h6">
                Привет, {savedUserName}!
              </Typography>
              <Box ml={3}>
                <Button
                  variant="text"
                  size="small"
                  sx={{ fontSize: "11px" }}
                  onClick={onDeleteName}
                >
                  Я не {savedUserName}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography>Введите имя</Typography>
              <Input
                size="small"
                onChange={onInputChange}
                name={"userName"}
                slotProps={{
                  input: {
                    sx: { textAlign: "center", py: 0 },
                  },
                }}
              />
              <Button onClick={onSaveClick} sx={{ fontSize: "11px" }}>
                Сохранить
              </Button>
            </>
          )}
        </Stack>
        <Typography variant="h3" color={"maroon"}>
          Всезнайка
        </Typography>
        <MultiplicationTableSolve table={getTable()} />
      </Stack>
    </>
  );
}

export default App;

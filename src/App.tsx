import { Stack, Typography } from "@mui/material";
import "./App.css";
import { MultiplicationTableSolve } from "./multiplicationTable/MultiplicationTable";
import { getTable } from "./calc/getMultiplicationTable";

import { UserName } from "./user/UserName";
import { createContext, useCallback, useEffect, useState } from "react";
import { checkIsAuth } from "./api/checkIsAuth";

export const UserContext = createContext<{ userName?: string } | null>(null);

function App() {
  const [userName, setUserName] = useState<string>();

  const onNameChanged = useCallback((userName?: string) => {
    setUserName(userName);
  }, []);

  useEffect(() => {
    if (!userName) {
      checkIsAuth().then((res) => {
        if (res.ok) {
          setUserName(res.userName);
        }
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userName }}>
      <Stack maxWidth="700px">
        <UserName onNameChanged={onNameChanged} />
        <Typography variant="h3" color={"maroon"}>
          Всезнайка
        </Typography>
        <MultiplicationTableSolve table={getTable()} />
      </Stack>
    </UserContext.Provider>
  );
}

export default App;

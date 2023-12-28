import { Stack, Typography } from "@mui/material";
import "./App.css";
import { MultiplicationTableSolve } from "./multiplicationTable/MultiplicationTable";
import { getTable } from "./calc/getMultiplicationTable";

import { createContext, useState } from "react";
import { Author } from "./Author";
import { Header } from "./header/Header";

export const UserContext = createContext<{ userName?: string } | null>(null);

function App() {
  const [userName, setUserName] = useState<string>();

  const onNameChanged = (userName?: string) => {
    setUserName(userName);
  };

  return (
    <UserContext.Provider value={{ userName }}>
      <Stack minHeight={"100vh"}>
        <Header onNameChanged={onNameChanged} />
        <Stack
          maxWidth="700px"
          p={0}
          my={0}
          mx={"auto"}
          textAlign={"center"}
          flexGrow={2}
        >
          <Typography variant="h3" color={"maroon"}>
            Всезнайка
          </Typography>
          <MultiplicationTableSolve table={getTable()} />
          <Author />
        </Stack>
      </Stack>
    </UserContext.Provider>
  );
}

export default App;

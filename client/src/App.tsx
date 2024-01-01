import { Stack, Typography } from "@mui/material";
import "./App.css";
import { MultiplicationTableSolve } from "./multiplicationTable/MultiplicationTable";
import { getTable } from "./calc/getMultiplicationTable";

import { createContext, useState } from "react";
import { Author } from "./Author";
import { Header } from "./header/Header";
import { User } from "./types/api.types";

export const UserContext = createContext<User | null>(null);

function App() {
  const [user, setUser] = useState<User | null>(null);

  const onNameChanged = (user: User | null) => {
    setUser(user);
  };

  return (
    <UserContext.Provider value={user}>
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

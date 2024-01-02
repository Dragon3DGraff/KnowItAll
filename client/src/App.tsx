import { Stack, Typography } from "@mui/material";
import "./App.css";

import { createContext, useState } from "react";
import { Author } from "./Author";
import { Header } from "./header/Header";
import { User } from "./types/api.types";
import { Outlet } from "react-router-dom";

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
        <Typography variant="h3" color={"maroon"} alignSelf={"center"}>
          Всезнайка
        </Typography>
        <Stack maxWidth="700px" textAlign={"center"} flexGrow={2} mx={"auto"}>
          <Outlet />
        </Stack>

        <Author />
      </Stack>
    </UserContext.Provider>
  );
}

export default App;

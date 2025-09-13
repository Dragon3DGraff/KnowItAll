import { Stack, Typography, useMediaQuery } from "@mui/material";
import "./App.css";

import { createContext, useState } from "react";
import { Author } from "./footer/Author";
import { Header } from "./header/Header";
import { User } from "./types/api.types";
import { Outlet } from "react-router-dom";
import { DevInfo } from "./DevInfo";
import { BestTable } from "./multiplicationTable/BestTable";

export const UserContext = createContext<User | null>(null);

function App() {
  const [user, setUser] = useState<User | null>(null);

  const onNameChanged = (user: User | null) => {
    setUser(user);
  };
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <UserContext.Provider value={user}>
      <Stack minHeight={"100vh"} width={"100vw"}>
        <DevInfo />
        <Header onNameChanged={onNameChanged} />
        <Typography variant={isMobile ? "h4" : "h3"} color={"maroon"} alignSelf={"center"}>
          Всезнайка
        </Typography>
        <BestTable />
        <Stack maxWidth="700px" textAlign={"center"} flexGrow={2} mx={"auto"}>
          <Outlet />
        </Stack>

        <Author />
      </Stack>
    </UserContext.Provider>
  );
}

export default App;

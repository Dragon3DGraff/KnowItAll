import { Stack, Typography } from "@mui/material";
import "./App.css";
import { MultiplicationTableSolve } from "./multiplicationTable/MultiplicationTable";
import { getTable } from "./calc/getMultiplicationTable";

function App() {
  return (
    <>
      <Stack maxWidth="700px">
        <Typography variant="h2" color={"maroon"}>
          Всезнайка
        </Typography>
        <MultiplicationTableSolve table={getTable()} />
      </Stack>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import { numbers } from "../calc/getMultiplicationTable";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Equation } from "./Equation";
import {
  MultiplicationTable,
  Sign,
  Solution,
  TableItem,
} from "../types/multiplication.types";
import { secondsToMin } from "../utils/secondsToMin";
import { arrayShuffle } from "../utils/arrayShuffle";
import { StorageHelper } from "../utils/StorageHelper";

type Props = {
  table: MultiplicationTable;
};
export const MultiplicationTableSolve = ({ table }: Props) => {
  const [selectedNumbers, setSelectedNumbers] = useState<
    Record<number, boolean>
  >(StorageHelper.get("selectedNumbers"));

  const [results, setResults] = useState<Solution[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [task, setTask] = useState<TableItem[]>([]);
  const [interval, setIntervalNumber] = useState<NodeJS.Timeout>();

  useEffect(() => {
    let interv: number | NodeJS.Timeout;
    if (started) {
      interv = setInterval(() => {
        setTimer((prev) => {
          if (prev + 1 === 180) {
            clearInterval(interv);
          }
          return prev + 1;
        });
      }, 1000);
      setIntervalNumber(interv);
    }
    return () => {
      clearInterval(interv);
      setIntervalNumber(undefined);
    };
  }, [started]);

  const handleCheckNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedNumbers({
      ...selectedNumbers,
      [event.target.name]: event.target.checked,
    });
  };

  const onSolve = (result: Solution) => {
    setResults((prev) => [...prev, result]);
  };

  useEffect(() => {
    if (interval && results.length === task.length) {
      setIntervalNumber(undefined);
      clearInterval(interval);
    }
  }, [results, interval, task.length]);

  const getTimerColor = (timer: number) => {
    let color = "darkgrey";
    if (timer > 90) {
      color = "#FFA500";
    }
    if (timer > 120) {
      color = "#FF4500";
    }
    if (timer >= 180) {
      color = "#FF0000";
    }

    return color;
  };

  const onStart = () => {
    const checkedNumbers: number[] = [];
    Object.entries(selectedNumbers).forEach(([key, val]) => {
      if (val) {
        checkedNumbers.push(Number(key));
      }
    });
    const taskArray: TableItem[] = [];
    checkedNumbers.forEach((num) => {
      taskArray.push(...table[Sign.multiplication][num]);
      taskArray.push(...table[Sign.division][num]);
    });

    if (taskArray.length) {
      setTask(arrayShuffle(taskArray.slice(0, 38)));

      setStarted(true);
    }
  };

  const selectAllNumbers = () => {
    const newSelectedNumbers: Record<number, boolean> = {};
    const selected = Object.values(selectedNumbers).filter(Boolean);
    numbers.forEach((num) => {
      newSelectedNumbers[num] = numbers.length !== selected.length;
    });
    setSelectedNumbers(newSelectedNumbers);
  };

  useEffect(() => {
    localStorage.setItem("selectedNumbers", JSON.stringify(selectedNumbers));
  }, [selectedNumbers]);

  useEffect(() => {
    const getServer = async () => {
      const response = await fetch("/api/check/checkAuth", {
        method: "POST",
      });
      console.log(response);
    };

    getServer();
  }, []);

  return (
    <Stack>
      <Typography variant="h4">Таблица умножения</Typography>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {started ? (
          <Stack direction={"row"}>
            <Typography variant="h5" color={getTimerColor(timer)}>
              {secondsToMin(timer)}
            </Typography>
            <Stack direction={"row"} alignItems={"flex-end"} gap={2} pl={2}>
              <Typography color={"#2e7d32"}>
                Правильно {results.filter((item) => item.result).length}
              </Typography>
              <Typography color={"#FF0000"}>
                Неправильно {results.filter((item) => !item.result).length}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">
              <Typography variant="h6">
                Выбери на что будем делить и умножать
              </Typography>
            </FormLabel>
            <Stack direction={"row"}>
              <FormGroup key={"all"}>
                <FormControlLabel
                  control={<Checkbox onChange={selectAllNumbers} name="all" />}
                  label="Все"
                />
              </FormGroup>
              {numbers.map((number) => (
                <FormGroup key={number}>
                  <FormControlLabel
                    checked={Boolean(selectedNumbers[number])}
                    control={
                      <Checkbox
                        onChange={handleCheckNumberChange}
                        name={`${number}`}
                      />
                    }
                    label={number}
                  />
                </FormGroup>
              ))}
            </Stack>
          </FormControl>
        )}
      </Box>
      {started ? (
        <Stack flexWrap={"wrap"} maxHeight={"60vh"}>
          {task.map((tableItem) => (
            <Equation
              key={`${tableItem.answer} + ${tableItem.number1}`}
              number1={tableItem.number1}
              number2={tableItem.number2}
              actionSign={tableItem.actionSign}
              onSolve={onSolve}
              answer={tableItem.answer}
            />
          ))}
        </Stack>
      ) : (
        <Button variant="contained" size="large" onClick={onStart}>
          Начали!
        </Button>
      )}
    </Stack>
  );
};

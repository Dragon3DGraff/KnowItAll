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
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MoodBadIcon from "@mui/icons-material/MoodBad";

type Props = {
  table: MultiplicationTable;
};
export const MultiplicationTableSolve = ({ table }: Props) => {
  const [selectedNumbers, setSelectedNumbers] = useState<
    Record<number, boolean>
  >(StorageHelper.get("selectedNumbers") ?? {});

  const [results, setResults] = useState<Solution[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
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
    setResults((prev) => {
      if (prev.some((item) => item.id === result.id)) {
        return prev.map((item) => (item.id === result.id ? result : item));
      }
      return [...prev, result];
    });
  };

  const onFinished = () => {
    clearInterval(interval);
    setIntervalNumber(undefined);
    setFinished(true);
  };

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

  const getTimerSmile = (timer: number) => {
    let smile = <TagFacesIcon />;
    if (timer > 90) {
      smile = <SentimentSatisfiedIcon />;
    }
    if (timer > 120) {
      smile = <SentimentVeryDissatisfiedIcon />;
    }
    if (timer >= 180) {
      smile = <MoodBadIcon />;
    }

    return smile;
  };

  const allFilled = interval && results.length === task.length;

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
      arrayShuffle(taskArray);
      setTask(taskArray.slice(0, 38));

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
    // const getServer = async () => {
    //   const response = await fetch(
    //     "https://tertiusaxis.ru/api/check/checkAuth",
    //     {
    //       method: "POST",
    //     }
    //   );
    //   console.log(response);
    // };
    // getServer();
  }, []);

  const areAllSelected = () => {
    const selected = Object.values(selectedNumbers).filter(Boolean);
    return numbers.length === selected.length;
  };

  const onReplay = () => {
    setTimer(0);
    setResults([]);

    setFinished(false);
    setTask([]);
    setStarted(false);
  };

  return (
    <Stack>
      <Typography variant="h4">Таблица умножения</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Stack direction={"row"}>
          {started && (
            <Stack direction={"row"} alignItems={"center"}>
              <Box mr={1}>{getTimerSmile(timer)}</Box>
              <Typography variant="h5" color={getTimerColor(timer)}>
                {secondsToMin(timer)}
              </Typography>{" "}
            </Stack>
          )}

          {finished && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              pl={2}
              justifyContent={"center"}
            >
              <Typography color={"#2e7d32"}>
                Правильно {results.filter((item) => item.result).length}
              </Typography>
              <Typography color={"#FF0000"}>
                Неправильно {results.filter((item) => !item.result).length}
              </Typography>
              <Button onClick={onReplay}>Заново</Button>
            </Stack>
          )}
        </Stack>

        {!started && (
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">
              <Typography variant="h6">
                Выбери на что будем делить и умножать
              </Typography>
            </FormLabel>
            <Stack direction={"row"}>
              <FormGroup key={"all"}>
                <FormControlLabel
                  checked={areAllSelected()}
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
        <Stack flexWrap={"wrap"} maxHeight={"360px"} mt={1}>
          {finished && results.length
            ? results.map((result, i) => (
                <Equation
                  key={result.id}
                  id={result.id}
                  userAnswer={result.userAnswer}
                  number1={result.number1}
                  number2={result.number2}
                  actionSign={result.actionSign}
                  answer={result.answer}
                  tabIndex={i}
                />
              ))
            : task.map((tableItem, i) => (
                <Equation
                  key={tableItem.id}
                  id={tableItem.id}
                  userAnswer={undefined}
                  number1={tableItem.number1}
                  number2={tableItem.number2}
                  actionSign={tableItem.actionSign}
                  answer={tableItem.answer}
                  tabIndex={i}
                  onSolve={onSolve}
                />
              ))}
          {allFilled && (
            <Box my={1}>
              <Button variant="contained" size="large" onClick={onFinished}>
                Готово!
              </Button>
            </Box>
          )}
          {!allFilled && !finished && (
            <Box my={1} mt={"auto"}>
              <Button onClick={onReplay} sx={{ width: "fit-content" }}>
                Сдаться
              </Button>
            </Box>
          )}
        </Stack>
      ) : (
        <Box my={2}>
          <Button variant="contained" size="large" onClick={onStart}>
            Начали!
          </Button>
        </Box>
      )}
    </Stack>
  );
};

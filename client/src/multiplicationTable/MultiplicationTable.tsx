import { useContext, useState } from "react";
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
  Switch,
  Typography,
} from "@mui/material";
import { Equation } from "./Equation";
import {
  MultiplicationTable,
  Sign,
  Result,
  TableItem,
  Mode,
} from "../types/multiplication.types";
import { arrayShuffle } from "../utils/arrayShuffle";
import { StorageHelper } from "../utils/StorageHelper";

import { SELECTED_NUMBERS } from "../utils/constants";
import { sendResults } from "../api/sendResults";
import { Header } from "./Header";
import { UserContext } from "../App";

type Props = {
  table: MultiplicationTable;
};
export const MultiplicationTableSolve = ({ table }: Props) => {
  const [selectedNumbers, setSelectedNumbers] = useState<
    Record<string, boolean>
  >(StorageHelper.get(SELECTED_NUMBERS) ?? {});

  const [results, setResults] = useState<Result[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [task, setTask] = useState<TableItem[]>([]);
  const user = useContext(UserContext);
  const [mode, setMode] = useState<Mode>(Mode.EXAM);
  const [isSended, setIsSended] = useState<boolean>(false);

  const handleCheckNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSelectedNumbers = {
      ...selectedNumbers,
      [`${event.target.name}`]: event.target.checked,
    };

    setSelectedNumbers(newSelectedNumbers);
    StorageHelper.save(SELECTED_NUMBERS, newSelectedNumbers);
  };

  const selectAllNumbers = () => {
    const newSelectedNumbers: Record<number, boolean> = {};
    const selected = Object.values(selectedNumbers).filter(Boolean);
    numbers.forEach((num) => {
      newSelectedNumbers[num] = numbers.length !== selected.length;
    });
    setSelectedNumbers(newSelectedNumbers);
    StorageHelper.save(SELECTED_NUMBERS, newSelectedNumbers);
  };

  const onSolve = (result: Result) => {
    setResults((prev) => {
      if (prev.some((item) => item.id === result.id)) {
        return prev.map((item) => (item.id === result.id ? result : item));
      }
      return [...prev, result];
    });
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
      arrayShuffle(taskArray);
      setTask(taskArray.slice(0, 38));
      setStarted(true);
    }
  };

  const onFinished = async () => {
    setFinished(true);
  };

  const onReplay = () => {
    setResults([]);
    setFinished(false);
    setTask([]);
    setStarted(false);
    setIsSended(false);
  };

  const surrender = () => {
    onReplay();
    sendResults(0, [], mode, user?.userName);
  };

  const onTimerFinished = async (timer: number) => {
    const res = await sendResults(timer, results, mode, user?.userName);
    setIsSended(true);

    if (res?.ok) {
      window.Ya.share2("ya", {
        theme: {
          services:
            "vkontakte,telegram,whatsapp,odnoklassniki,twitter,viber,skype,linkedin,reddit,qzone,renren,sinaWeibo,surfingbird,tencentWeibo",
          bare: false,
          limit: 3,
          // size: "l",
        },
        content: {
          url: `
            https://know-it-all.ru?share=${res.id}`,
          title: "Я решил!",
        },
      });
    }
  };

  const onModeChange = () => {
    setMode((prev) => (prev === Mode.EXAM ? Mode.TRAIN : Mode.EXAM));
  };

  const areAllSelected = () => {
    const selected = Object.values(selectedNumbers).filter(Boolean);
    return numbers.length === selected.length;
  };
  const allFilled = results.length === task.length;

  return (
    <Stack alignItems={"center"}>
      <Header
        started={started}
        finished={finished}
        onFinish={onTimerFinished}
        mode={mode}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Stack direction={"row"}>
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
          <Stack>
            <Typography variant="h6">
              {`${
                user?.userName ? user.userName : "Выбери"
              }, на что будем делить и умножать`}
            </Typography>
            <FormControl sx={{ my: 1 }} component="fieldset" variant="standard">
              <FormLabel component="legend"></FormLabel>
              <Box alignSelf={"center"} width={"250px"}>
                <FormGroup key={"all"}>
                  <Stack direction={"row"} gap={2}>
                    {/* {mode === Mode.EXAM ? (
                      <Box width={"40px"} height={"40px"}>
                        <img src="./super.png" />
                      </Box>
                    ) : (
                      <Box width={"40px"} height={"40px"}>
                        <img src="./itak.png" />
                      </Box>
                    )} */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={mode === Mode.EXAM}
                          onChange={onModeChange}
                        />
                      }
                      label={
                        mode === Mode.EXAM ? "Таймер включён " : "Без таймера"
                      }
                    />
                  </Stack>
                  <FormControlLabel
                    checked={areAllSelected()}
                    control={
                      <Checkbox onChange={selectAllNumbers} name="all" />
                    }
                    label="Выбрать все"
                  />
                </FormGroup>
              </Box>
              <Stack direction={"row"} flexWrap={"wrap"} alignItems={"center"}>
                {numbers.map((number) => (
                  <FormGroup key={number}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(selectedNumbers[`${number}`])}
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
          </Stack>
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
              {!isSended && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={onFinished}
                  disabled={isSended}
                >
                  Готово!
                </Button>
              )}
              <Box py={1}>
                <div id="ya" />
              </Box>
            </Box>
          )}
          {!allFilled && !finished && (
            <Box my={1} mt={"auto"}>
              <Button onClick={surrender} sx={{ width: "fit-content" }}>
                Сдаться
              </Button>
            </Box>
          )}
        </Stack>
      ) : (
        <Box my={2}>
          <Button
            variant="contained"
            size="large"
            disabled={
              Object.values(selectedNumbers).filter(Boolean).length === 0
            }
            onClick={onStart}
          >
            Начали!
          </Button>
        </Box>
      )}
      <Stack maxWidth={"400px"} mt={2}>
        <img src="./nez.png" />
      </Stack>
    </Stack>
  );
};

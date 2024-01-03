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
  Switch,
  Typography,
  styled,
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { secondsToMin } from "../utils/secondsToMin";
import { getStatisticsById } from "../api/getStatisticsById";
import { useUser } from "../hooks/useUser";

const TableGrid = styled(Stack)(({ theme }) => ({
  maxHeight: "380px",
  [theme.breakpoints.down("md")]: {
    maxHeight: "500px",
  },
  [theme.breakpoints.down("sm")]: {
    maxHeight: "700px",
  },
}));

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
  const { user } = useUser();
  const [mode, setMode] = useState<Mode>(Mode.EXAM);
  const [sended, setSended] = useState<{
    id: string;
    timer: number;
  } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [shared, setShared] = useState<{
    userName: string;
    timer: number;
  } | null>(null);

  const navigate = useNavigate();

  const sharedId = searchParams.get("share");

  useEffect(() => {
    if (sharedId && results.length === 0) {
      getStatisticsById(sharedId).then((res) => {
        if (!("error" in res)) {
          setResults(res.data.results);
          setShared({ userName: res.userName, timer: res.data.timer });
        } else {
          onReplay();
        }
      });
    }
  }, [sharedId]);

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
    setSended(null);
    setShared(null);
    navigate("/");
  };

  const surrender = () => {
    onReplay();
    sendResults(0, [], mode, user?.userName);
  };

  useEffect(() => {
    onReplay();
  }, [user]);

  useEffect(() => {
    if (sended) {
      if (user) {
        setSearchParams({ share: sended.id });

        const totalSolved = results.length;
        const correctCount = results.filter((item) => item.result).length;
        const title =
          mode === Mode.EXAM
            ? `Я решил(а) правильно ${correctCount} из ${totalSolved} за ${secondsToMin(
                sended.timer
              )}!`
            : `Я решил(а) правильно ${correctCount} из ${totalSolved}!`;

        window.Ya.share2("ya", {
          theme: {
            services:
              "vkontakte,telegram,whatsapp,odnoklassniki,twitter,viber,skype,linkedin,reddit,qzone,renren,sinaWeibo,surfingbird,tencentWeibo",
            bare: false,
            limit: 3,
          },
          content: {
            url: `
            https://know-it-all.ru?share=${sended.id}`,
            title,
          },
        });
      }
    }
  }, [sended]);

  const onTimerFinished = async (timer: number) => {
    const res = await sendResults(timer, results, mode, user?.userName);

    if (res?.ok) {
      setSended({ id: res.id, timer });
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
    <Stack alignItems={"center"} p={0} my={0}>
      <Header
        started={started}
        finished={finished}
        onFinish={onTimerFinished}
        mode={mode}
      />
      {shared && shared?.userName && (
        <Stack>
          <Typography>Результаты пользователя {shared.userName}</Typography>
          <Typography color={"#0000FF"} fontWeight={700}>
            Время {secondsToMin(shared.timer)}
          </Typography>
        </Stack>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Stack direction={"row"}>
          {(finished || (shared && results)) && (
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
              <Button onClick={onReplay} variant="contained">
                {shared ? "Решу лучше" : "Заново"}
              </Button>
            </Stack>
          )}
        </Stack>

        {!started && !shared && (
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
              <Stack
                direction={"row"}
                flexWrap={"wrap"}
                alignItems={"center"}
                px={2}
              >
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
      {shared ? (
        <TableGrid flexWrap={"wrap"} mt={1}>
          {results.map((result, i) => (
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
          ))}
        </TableGrid>
      ) : started ? (
        <TableGrid flexWrap={"wrap"} mt={1}>
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
              {!finished && (
                <Button variant="contained" size="large" onClick={onFinished}>
                  Готово!
                </Button>
              )}
            </Box>
          )}
          {/* {sended && ( */}
          <Box py={1}>
            <div id="ya" />
          </Box>
          {/* )} */}
          {!allFilled && !finished && (
            <Box my={1} mt={"auto"}>
              <Button onClick={surrender} sx={{ width: "fit-content" }}>
                Сдаться
              </Button>
            </Box>
          )}
        </TableGrid>
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

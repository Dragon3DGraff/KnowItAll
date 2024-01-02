import { Button, Stack } from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import { getStatistics } from "../api/getStatistics";
import { useNavigate } from "react-router-dom";
import { MultiplationsStatistics } from "../types/multiplication.types";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import format from "date-fns/format";
import { ru } from "date-fns/locale";
import { UserContext } from "../App";

function Row(props: { row: MultiplationsStatistics }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow
        // sx={{ "& > *": { borderBottom: "unset" } }}
        sx={{ "&:last-child td, &:last-child th": { borderBottom: "unset" } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {format(Date.parse(row.date), "Pp", {
            locale: ru,
          })}
        </TableCell>
        <TableCell align="right">{row.timer}</TableCell>
        <TableCell align="right">{row.solvedCount}</TableCell>
        <TableCell align="right">{row.correctCount}</TableCell>
        <TableCell align="right">{row.incorrectCount}</TableCell>
        <TableCell align="right">{row.numbers}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Подробно
              </Typography>
              <Table size="small" aria-label="results">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Пример</TableCell>
                    <TableCell align="right">Ответ</TableCell>
                    <TableCell align="right">Правильный ответ</TableCell>
                    <TableCell align="right">Правильно</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.results.map((result) => (
                    <TableRow
                      key={result.id}
                      sx={{ bgcolor: result.result ? "white" : "#F08080" }}
                    >
                      <TableCell align="right">{result.id}</TableCell>
                      <TableCell align="right">{result.userAnswer}</TableCell>
                      <TableCell align="right">{result.answer}</TableCell>
                      <TableCell align="right">
                        {result.result ? "Да" : "Нет"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
export const Statistics = () => {
  const user = useContext(UserContext);

  const navigate = useNavigate();

  const [results, setResults] = useState<MultiplationsStatistics[]>([]);
  useEffect(() => {
    user &&
      getStatistics().then((res) => {
        if (!("error" in res)) {
          setResults(res);
        }
      });
  }, [user]);

  if (!user) {
    return (
      <>
        <Typography variant="h5">Статистика</Typography>
        <Typography variant="h6">
          Доступно только зарегистрированным пользователям
        </Typography>
      </>
    );
  }

  const totalSolved = results.length;
  const surrended = results.filter((res) => res.timer === 0).length;
  const examplesCount = results.reduce(
    (prev, cur) => (prev += cur.results.length),
    0
  );

  const errorsCount = results.reduce(
    (prev, cur) => (prev += cur.results.filter((item) => !item.result).length),
    0
  );
  const correctCount = results.reduce(
    (prev, cur) => (prev += cur.results.filter((item) => item.result).length),
    0
  );

  return (
    <Stack>
      <Button
        onClick={() => navigate("/")}
        sx={{ maxWidth: "fit-content" }}
        variant="contained"
      >
        Решать примеры
      </Button>
      <Typography variant="h5">Статистика</Typography>
      <Stack alignItems={"flex-end"} px={4}>
        <Typography>Сколько раз решал: {totalSolved}</Typography>
        <Typography>Сколько решил примеров: {examplesCount}</Typography>
        <Typography>Правильно решил примеров: {correctCount}</Typography>
        <Typography>Неправильно решил примеров: {errorsCount}</Typography>
        <Typography>Сдался: {surrended}</Typography>
      </Stack>

      {results.length ? (
        <TableContainer component={Paper}>
          <Table aria-label="results table" size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Дата</TableCell>
                <TableCell align="right">Время</TableCell>
                <TableCell align="right">Решено</TableCell>
                <TableCell align="right">Правильно</TableCell>
                <TableCell align="right">Неправильно</TableCell>
                <TableCell align="right">Числа</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result) => (
                <Row key={result.id} row={result} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6">Похоже ничего еще не решалось</Typography>
      )}
    </Stack>
  );
};

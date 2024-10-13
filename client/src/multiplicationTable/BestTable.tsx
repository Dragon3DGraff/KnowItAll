import { Stack, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { getBest } from "../api/getBest";
import { useUser } from "../hooks/useUser";
import { secondsToMin } from "../utils/secondsToMin";

function Row(props: {
  row: { name: string; timer: number; id: string };
  place: number;
  userId?: string;
}) {
  const { row, place, userId } = props;

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          {place === 0 ? "🏆" : place === 1 ? "🥈" : place === 2 ? "🥉" : ""}
        </TableCell>
        <TableCell align="right">
          <Typography color={row.id == userId ? "Highlight" : "InfoText"}>
            {row.name}
          </Typography>
        </TableCell>
        <TableCell align="right">{secondsToMin(row.timer)}</TableCell>
      </TableRow>
    </Fragment>
  );
}

export const BestTable = () => {
  const { user } = useUser();
  const [results, setResults] = useState<
    { name: string; timer: number; id: string }[]
  >([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    getBest().then((res) => {
      setResults(res);
    });

    const interval = setInterval(
      () =>
        getBest().then((res) => {
          setResults(res);
        }),
      50000
    );

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  if (!results.length) {
    return null;
  }
  return (
    <Stack alignItems={"center"} mb={1}>
      <Box width={400}>
        <TableContainer component={Paper}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            px={2}
            padding={1}
          >
            <Typography paddingLeft={1} variant="button">
              Лучшие результаты
            </Typography>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Stack>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table aria-label="Best table" size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Table size="small">
                      <TableBody>
                        {true &&
                          results.map((result, place) => (
                            <Row
                              key={place}
                              row={result}
                              place={place}
                              userId={user?.userId}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableContainer>
      </Box>
    </Stack>
  );
};

import { Stack, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { secondsToMin } from "../utils/secondsToMin";
import { useUser } from "../hooks/useUser";
import { getBest } from "../api/getBest";

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
          >
            <Typography variant="button">Лучшие результаты</Typography>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Stack>

          <Table aria-label="Best table" size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Table size="small">
                      <TableBody>
                        {open &&
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
                  </Collapse>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
};

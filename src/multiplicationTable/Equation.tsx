import { Box, Input, Stack, Tooltip, Typography } from "@mui/material";
import { Sign, Solution } from "../types/multiplication.types";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useState } from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

type Props = {
  id: string;
  number1: number;
  number2: number;
  actionSign: Sign;
  onSolve?: (result: Solution) => void;
  answer: number;
  tabIndex: number;
  userAnswer?: number;
};
export const Equation = ({
  number1,
  number2,
  actionSign,
  answer,
  onSolve,
  tabIndex,
  id,
  userAnswer,
}: Props) => {
  const [inputValue, setInputValue] = useState<number>();

  const onInputChange = (e: { target: { value: string } }) => {
    onSolve &&
      onSolve({
        number1,
        number2,
        actionSign,
        result: answer === Number.parseFloat(e.target.value),
        userAnswer: Number.parseFloat(e.target.value),
        answer,
        id,
      });
    setInputValue(Number.parseFloat(e.target.value));
  };

  const getColor = () => {
    if (!userAnswer) {
      return "primary";
    }
    return userAnswer === answer ? "success" : "error";
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"end"}
      pr={"24px"}
      my={0.5}
    >
      <Typography>{number1}</Typography>
      <Typography px={0.5}>{actionSign}</Typography>
      <Typography>{number2}</Typography>
      <Typography px={0.5}>=</Typography>
      <Box width={"45px"} mr={1} border={`1px solid darkgrey`}>
        {userAnswer ? (
          <Typography px={0.5} color={getColor()}>
            {inputValue}
          </Typography>
        ) : (
          <Input
            size="small"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            autoComplete="off"
            onChange={onInputChange}
            disableUnderline
            name={"answer"}
            tabIndex={tabIndex}
            slotProps={{
              input: {
                sx: { textAlign: "center", py: 0 },
                autoComplete: "off",
              },
            }}
          />
        )}
      </Box>
      {userAnswer && (
        <>
          {userAnswer === answer ? (
            <TaskAltIcon color={getColor()} />
          ) : (
            <Tooltip title={answer} disableInteractive>
              <ReportProblemIcon color={getColor()} />
            </Tooltip>
          )}
        </>
      )}
    </Stack>
  );
};

import { Box, IconButton, Input, Stack, Typography } from "@mui/material";
import { Sign, Solution } from "../types/multiplication.types";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useState } from "react";

type Props = {
  number1: number;
  number2: number;
  actionSign: Sign;
  onSolve: (result: Solution) => void;
  answer: number;
};
export const Equation = ({
  number1,
  number2,
  actionSign,
  answer,
  onSolve,
}: Props) => {
  const [inputValue, setInputValue] = useState<number>();
  const [userAnswer, setUserAnswer] = useState<number>();

  const onButtonClickHandler = () => {
    if (inputValue) {
      setUserAnswer(inputValue);
      onSolve({
        number1,
        number2,
        actionSign,
        result: answer === inputValue,
        userAnswer: inputValue,
        answer,
      });
    }
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
            onChange={(e) => setInputValue(Number.parseFloat(e.target.value))}
            disableUnderline
            name={"answer"}
            slotProps={{
              input: {
                sx: { textAlign: "center", py: 0 },
                autoComplete: "off",
              },
            }}
          />
        )}
      </Box>
      <IconButton
        color={getColor()}
        aria-label="solve"
        onClick={onButtonClickHandler}
        size="small"
      >
        <TaskAltIcon />
      </IconButton>
    </Stack>
  );
};

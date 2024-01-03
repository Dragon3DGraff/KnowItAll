import { Box, Input, Stack, Typography, styled } from "@mui/material";
import { Sign, Result } from "../types/multiplication.types";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const StyledInput = styled(Input)(() => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

type Props = {
  id: string;
  number1: number;
  number2: number;
  actionSign: Sign;
  onSolve?: (result: Result) => void;
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
      <Typography px={0.5}>
        <span>{actionSign}</span>
      </Typography>
      <Typography>{number2}</Typography>
      <Typography px={0.5}>=</Typography>
      <Box width={"45px"} mr={1} border={`1px solid darkgrey`}>
        {userAnswer ? (
          <Typography px={0.5} color={getColor()}>
            {userAnswer}
          </Typography>
        ) : (
          <StyledInput
            size="small"
            type="number"
            inputMode="numeric"
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
        <Box width={"20px"}>
          {userAnswer === answer ? (
            <TaskAltIcon color={getColor()} />
          ) : (
            <Typography fontWeight={700} color={getColor()}>
              {answer}
            </Typography>
          )}
        </Box>
      )}
    </Stack>
  );
};

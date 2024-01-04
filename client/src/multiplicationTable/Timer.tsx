import { Box, Stack, Typography, styled } from "@mui/material";
import { secondsToMin } from "../utils/secondsToMin";
import { useState, useEffect } from "react";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import { createPortal } from "react-dom";
import { TIMER_STEPS } from "../utils/constants";
import { Mode } from "../types/multiplication.types";

const TimerDiv = styled(Box)(() => ({
  left: "calc( 50vw - 57px)",
}));

type Props = {
  started: boolean;
  finished: boolean;
  mode: Mode;
  onFinish: (timer: number) => void;
  onTimerStop: () => void;
};
export const Timer = ({
  started,
  finished,
  mode,
  onFinish,
  onTimerStop,
}: Props) => {
  const [timer, setTimer] = useState<number>(0);
  const [interval, setIntervalNumber] = useState<NodeJS.Timeout>();

  useEffect(() => {
    let interv: number | NodeJS.Timeout;
    if (started) {
      interv = setInterval(() => {
        setTimer((prev) => {
          if (mode === Mode.EXAM && prev + 1 === TIMER_STEPS.end) {
            clearInterval(interv);
            onTimerStop();
          }
          return prev + 1;
        });
      }, 1000);
      setIntervalNumber(interv);
    } else {
      clearInterval(interval);
      setIntervalNumber(undefined);
    }
    return () => {
      clearInterval(interv);
      setIntervalNumber(undefined);
    };
  }, [started]);

  useEffect(() => {
    if (finished) {
      clearInterval(interval);
      setIntervalNumber(undefined);
      onFinish(timer);
    }
  }, [finished]);

  const getTimerColor = (timer: number) => {
    let color = "darkgrey";
    if (timer > TIMER_STEPS.four) {
      color = "#FFA500";
    }
    if (timer > TIMER_STEPS.three) {
      color = "#FF4500";
    }
    if (timer >= TIMER_STEPS.end) {
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
  return createPortal(
    <TimerDiv
      position={"absolute"}
      top={"5px"}
      px={1}
      py={0.5}
      bgcolor={"#fff"}
      borderRadius={"26px"}
      border={"3px solid #1976d2"}
      boxShadow={"6px 10px 10px"}
    >
      {mode === Mode.EXAM ? (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          {getTimerSmile(timer)}
          <Typography variant="h5" color={getTimerColor(timer)}>
            {secondsToMin(timer)}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="h5" color={"lightgray"}>
          {secondsToMin(0)}
        </Typography>
      )}
    </TimerDiv>,
    document.body
  );
};

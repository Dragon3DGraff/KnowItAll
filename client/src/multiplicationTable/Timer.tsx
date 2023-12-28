import { Box, Stack, Typography } from "@mui/material";
import { secondsToMin } from "../utils/secondsToMin";
import { useState, useEffect } from "react";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import { createPortal } from "react-dom";
import { TIMER_STEPS } from "../utils/constants";
import { Mode } from "../types/multiplication.types";

type Props = {
  started: boolean;
  finished: boolean;
  onFinish: (timer: number) => void;
  mode: Mode;
};
export const Timer = ({ started, finished, mode, onFinish }: Props) => {
  const [timer, setTimer] = useState<number>(0);
  const [interval, setIntervalNumber] = useState<NodeJS.Timeout>();

  useEffect(() => {
    let interv: number | NodeJS.Timeout;
    if (started) {
      interv = setInterval(() => {
        setTimer((prev) => {
          if (prev + 1 === TIMER_STEPS.end) {
            clearInterval(interv);
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
    <Stack
      direction={"row"}
      alignItems={"center"}
      position={"absolute"}
      top={30}
      left={0}
      m={2}
    >
      {mode === Mode.EXAM ? (
        <>
          <Box mr={1}>{getTimerSmile(timer)}</Box>
          <Typography variant="h5" color={getTimerColor(timer)}>
            {secondsToMin(timer)}
          </Typography>
        </>
      ) : (
        <Typography variant="h5" color={"lightgray"}>
          {secondsToMin(0)}
        </Typography>
      )}
    </Stack>,
    document.body
  );
};

import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

type Props = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onGoToStart?: () => void;
  isAtStart?: boolean;
};

export const ReaderControls = ({
  label,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onGoToStart,
  isAtStart,
}: Props) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    px={0.5}
  >
    <Stack direction="row" alignItems="center" spacing={0}>
      {onGoToStart && (
        <IconButton
          size="small"
          onClick={onGoToStart}
          disabled={isAtStart}
          aria-label="В начало"
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
      )}
      <Button
        size="small"
        startIcon={<NavigateBeforeIcon />}
        onClick={onPrev}
        disabled={!hasPrev}
      >
        Назад
      </Button>
    </Stack>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      {label}
    </Typography>
    <Button
      size="small"
      endIcon={<NavigateNextIcon />}
      onClick={onNext}
      disabled={!hasNext}
    >
      Далее
    </Button>
  </Stack>
);

type ChapterSelectProps = {
  chapters: { index: number; title: string }[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export const ChapterSelect = ({
  chapters,
  currentIndex,
  onSelect,
}: ChapterSelectProps) => (
  <FormControl size="small" fullWidth sx={{ py: 1, px: 0.5 }}>
    <Select
      value={currentIndex}
      onChange={(e) => onSelect(Number(e.target.value))}
    >
      {chapters.map((ch) => (
        <MenuItem key={ch.index} value={ch.index}>
          {ch.title}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

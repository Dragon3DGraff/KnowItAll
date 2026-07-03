import {
  Box,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { ViewMode } from "../types/literature.types";

type Props = {
  viewMode: ViewMode;
  fontSize: number;
  onViewModeChange: (mode: ViewMode) => void;
  onFontSizeChange: (size: number) => void;
  onAddBookmark: () => void;
  onOpenBookmarks: (anchor: HTMLElement) => void;
  bookmarksCount: number;
};

export const ReaderToolbar = ({
  viewMode,
  fontSize,
  onViewModeChange,
  onFontSizeChange,
  onAddBookmark,
  onOpenBookmarks,
  bookmarksCount,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        py: 1,
        px: { xs: 0.5, sm: 1 },
      }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          value={viewMode}
          onChange={(_, val) => {
            if (val) onViewModeChange(val);
          }}
        >
          <ToggleButton value="page">
            {isMobile ? "Стр." : "Страницы"}
          </ToggleButton>
          <ToggleButton value="chapter">
            {isMobile ? "Гл." : "Главы"}
          </ToggleButton>
          <ToggleButton value="scroll">
            {isMobile ? "Текст" : "Весь текст"}
          </ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => onFontSizeChange(fontSize - 1)}
            disabled={fontSize <= 14}
            aria-label="Уменьшить шрифт"
          >
            <TextDecreaseIcon />
          </IconButton>
          <Typography variant="caption" sx={{ minWidth: 28, textAlign: "center" }}>
            {fontSize}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onFontSizeChange(fontSize + 1)}
            disabled={fontSize >= 24}
            aria-label="Увеличить шрифт"
          >
            <TextIncreaseIcon />
          </IconButton>
        </Stack>

        <IconButton
          size="small"
          onClick={onAddBookmark}
        >
          <BookmarkAddIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={(e) => onOpenBookmarks(e.currentTarget)}
          aria-label={`Закладки (${bookmarksCount})`}
        >
          <BookmarkIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

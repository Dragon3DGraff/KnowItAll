import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { BookBookmark } from "../types/literature.types";

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  bookmarks: BookBookmark[];
  onJump: (bookmark: BookBookmark) => void;
  onDelete: (id: number) => void;
};

export const BookmarksPanel = ({
  open,
  anchorEl,
  onClose,
  bookmarks,
  onJump,
  onDelete,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const content =
    bookmarks.length === 0 ? (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        Закладок пока нет
      </Typography>
    ) : (
      <List dense disablePadding>
        {bookmarks.map((bookmark) => (
          <ListItem
            key={bookmark.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                aria-label="Удалить закладку"
                onClick={() => onDelete(bookmark.id)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => {
                onJump(bookmark);
                onClose();
              }}
            >
              <ListItemText primary={bookmark.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );

  if (isMobile) {
    return (
      <Drawer anchor="bottom" open={open} onClose={onClose}>
        <Box sx={{ p: 2, maxHeight: "50vh", overflow: "auto" }}>
          <Typography variant="h6" gutterBottom>
            Закладки
          </Typography>
          {content}
        </Box>
      </Drawer>
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Box sx={{ width: 320, maxHeight: 400, overflow: "auto" }}>
        <Typography variant="subtitle1" sx={{ p: 2, pb: 0 }}>
          Закладки
        </Typography>
        {content}
      </Box>
    </Popover>
  );
};

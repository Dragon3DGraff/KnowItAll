import styled from "@emotion/styled";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import { useState } from "react";

const InfoDiv = styled(Box)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const Foto = styled(Box)(() => ({
  img: {
    width: "30px",
    height: " 30px",
    borderRadius: "15px",
    margin: "4px",
  },
}));

export const Info = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <InfoDiv onClick={handleClick}>
        <InfoIcon fontSize="small" />
      </InfoDiv>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box px={2} pt={1}>
          <Typography>Contributors</Typography>
        </Box>

        <Stack direction={"row"} alignItems={"center"} px={2}>
          <ListItemIcon>
            <Foto>
              <img src="https://avatars.githubusercontent.com/u/51860375?s=64&v=4" />
            </Foto>
          </ListItemIcon>
          <ListItemText>
            <a
              href="https://github.com/Dragon3DGraff"
              target="_blank"
              rel="noopener noreferrer"
            >
              Денисов Илья
            </a>
          </ListItemText>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} px={2}>
          <ListItemIcon>
            <Foto>
              <img src="https://avatars.githubusercontent.com/u/44137805?s=64&v=4" />
            </Foto>
          </ListItemIcon>
          <ListItemText>
            <a
              href="https://github.com/wishhdd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Корнилов Константин
            </a>
          </ListItemText>
        </Stack>

        <Divider />

        <Stack direction={"row"} alignItems={"center"} px={2.5} pt={1}>
          <ListItemIcon>
            <Foto>
              <svg
                height="32"
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                width="32"
                data-view-component="true"
                className="octicon octicon-mark-github v-align-middle color-fg-default"
              >
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </Foto>
          </ListItemIcon>
          <ListItemText>
            <a
              href="https://github.com/Dragon3DGraff/KnowItAll"
              target="_blank"
              rel="noopener noreferrer"
            >
              Repo
            </a>
          </ListItemText>
        </Stack>
      </Menu>
    </Box>
  );
};

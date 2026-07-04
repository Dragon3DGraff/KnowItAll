import { Button, IconButton, Stack, useMediaQuery } from "@mui/material"
import { useEffect } from "react"
import { checkIsAuth } from "../api/checkIsAuth"
import { UserName } from "../user/UserName"
import { setAnonimId } from "../api/setAnonimId"
import { User } from "../types/api.types"
import { useLocation, useNavigate } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useUser } from "../hooks/useUser"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"

type Props = {
  onNameChanged: (user: User | null) => void
}

const navButtonSx = {
  p: 0.25,
  fontSize: "11px",
  minWidth: 0,
}

export const Header = ({ onNameChanged }: Props) => {
  const { user, isAdmin } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery("(max-width: 600px)")

  useEffect(() => {
    if (!user?.userName) {
      checkIsAuth().then((res) => {
        if (!res.error) {
          onNameChanged(res)
        } else {
          setAnonimId()
        }
      })
    }
  }, [])

  return (
    <Stack direction={"row"} width={"100%"} justifyContent={"space-between"}>
      <Stack
        gap={isMobile ? 0.25 : 0.5}
        direction={"row"}
        p={isMobile ? 0.5 : 1}
        flexWrap="wrap"
        alignItems="center"
      >
        {location.pathname !== "/" ? (
          isMobile ? (
            <IconButton
              size="small"
              onClick={() => navigate("/")}
              aria-label="Домой"
              sx={{ p: 0.25 }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              size="small"
              sx={navButtonSx}
              onClick={() => navigate("/")}
              startIcon={<ArrowBackIcon />}
            >
              Домой
            </Button>
          )
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={{
                ...navButtonSx,
                textAlign: "center",
                svg: { mr: isMobile ? 0 : 1 },
              }}
              onClick={() => navigate("/statistics")}
            >
              {isMobile ? <EmojiEventsIcon fontSize="small" /> : "Достижения"}
            </Button>
            {user &&
              (isMobile ? (
                <IconButton
                  size="small"
                  onClick={() => navigate("/literature")}
                  aria-label="Литература"
                  sx={{ p: 0.25 }}
                >
                  <MenuBookIcon fontSize="small" />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  sx={navButtonSx}
                  onClick={() => navigate("/literature")}
                >
                  Литература
                </Button>
              ))}
          </>
        )}
        {isAdmin &&
          (isMobile ? (
            <>
              <IconButton
                size="small"
                onClick={() => navigate("/admin")}
                aria-label="Админка"
                sx={{ p: 0.25 }}
              >
                <AdminPanelSettingsIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => navigate("/game")}
                aria-label="Игра"
                sx={{ p: 0.25 }}
              >
                <SportsEsportsIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                sx={navButtonSx}
                onClick={() => navigate("/admin")}
              >
                Админка
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={navButtonSx}
                onClick={() => navigate("/game")}
              >
                Игра
              </Button>
            </>
          ))}
      </Stack>
      <UserName onNameChanged={onNameChanged} />
    </Stack>
  )
}

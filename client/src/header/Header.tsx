import { Button, Stack, useMediaQuery } from "@mui/material"
import { useEffect } from "react"
import { checkIsAuth } from "../api/checkIsAuth"
import { UserName } from "../user/UserName"
import { setAnonimId } from "../api/setAnonimId"
import { User } from "../types/api.types"
import { useLocation, useNavigate } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useUser } from "../hooks/useUser"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

type Props = {
  onNameChanged: (user: User | null) => void
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
    <Stack
      direction={"row"}
      width={"100%"}
      justifyContent={"space-between"}
    >
      <Stack gap={0.5} direction={"row"} p={1}>
        {location.pathname !== "/" ? (
          <Button
            variant="outlined"
            size="small"
            sx={{ px: 0.5, fontSize: "11px" }}
            onClick={() => navigate("/")}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Домой
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            sx={{
              px: 0.5,
              fontSize: "11px",
              textAlign: "center",
              svg: { mr: 0 },
            }}
            onClick={() => navigate("/statistics")}
          >
            {isMobile ? <EmojiEventsIcon sx={{ mr: 1 }} /> : "Достижения"}
          </Button>
        )}
        {isAdmin && (
          <Button
            variant="outlined"
            size="small"
            sx={{ px: 0.5, fontSize: "11px" }}
            onClick={() => navigate("/admin")}
          >
            Админка
          </Button>
        )}
        {isAdmin && (
          <Button
            variant="outlined"
            size="small"
            sx={{ px: 0.5, fontSize: "11px" }}
            onClick={() => navigate("/game")}
          >
            Игра
          </Button>
        )}
      </Stack>
      <UserName onNameChanged={onNameChanged} />
    </Stack>
  )
}

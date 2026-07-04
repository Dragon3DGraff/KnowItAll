import { Typography, Box, useMediaQuery, Stack, IconButton } from "@mui/material"
import { useState } from "react"
import { Registration } from "./Registration"
import { Login } from "./Login"
import { logout } from "../api/logout"
import { AuthMenu } from "./AuthMenu"
import { User } from "../types/api.types"
import { useUser } from "../hooks/useUser"
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined"

type Props = {
  onNameChanged: (user: User | null) => void
}
export const UserName = ({ onNameChanged }: Props) => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { user } = useUser()
  const isMobile = useMediaQuery("(max-width: 600px)")

  const onDeleteName = async () => {
    await logout()
    onNameChanged(null)
  }

  const onRegistrationClose = () => {
    setIsRegistrationOpen(false)
  }

  const onLogin = (user: User) => {
    onNameChanged(user)
  }

  const onLoginOpen = () => {
    setIsLoginOpen(true)
  }

  const onLoginClose = () => {
    setIsLoginOpen(false)
  }

  return (
    <>
      {user?.userName ? (
        <Stack direction="row" pr={isMobile ? 1 : 2} alignItems="center">
            <Typography color={"green"} variant={isMobile ? "body2" : "h6"}>
              Привет, {user.userName}!
            </Typography>

          <Box>
            <IconButton
              onClick={onDeleteName}
            >
              <LoginOutlinedIcon sx={{ fontSize: isMobile ? "16px" : "24px" }} />
            </IconButton>
          </Box>
        </Stack>
      ) : (
        <Box px={2}>
          <AuthMenu
            onLoginOpen={onLoginOpen}
            onRegistrationOpen={() => setIsRegistrationOpen(true)}
          />
        </Box>
      )}

      <Registration
        open={isRegistrationOpen}
        onClose={onRegistrationClose}
        onLogin={onLogin}
        onLoginError={onLoginOpen}
      />
      <Login open={isLoginOpen} onClose={onLoginClose} onLogin={onLogin} />
    </>
  )
}

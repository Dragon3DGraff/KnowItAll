import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material"
import Grid from "@mui/material/Grid"
import { useNavigate } from "react-router-dom"
import { useUser } from "../hooks/useUser"

export const Home = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 600px)")
  const { user } = useUser()

  return (
    <Stack alignItems={"center"} px={2} py={2}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 960,
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(0,200,83,0.08))",
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Stack alignItems={"center"} mb={3}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            color={"primary"}
            fontWeight={800}
          >
            Выберите тренажёр
          </Typography>
          <Typography color={"text.secondary"}>
            Прокачай устный счёт или отработай таблицу умножения
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 6 }}>
              <CardContent>
                <Typography
                  gutterBottom
                  variant={isMobile ? "h6" : "h5"}
                  component="div"
                >
                  📚 Тренировка таблицы умножения
                </Typography>
                <Typography
                  variant={isMobile ? "caption" : "body2"}
                  color="text.secondary"
                >
                  Решай примеры на умножение и деление. Отслеживай прогресс и
                  делись результатами.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => navigate("/multi")}
                >
                  Перейти
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 6 }}>
              <CardContent>
                <Typography
                  gutterBottom
                  variant={isMobile ? "h6" : "h5"}
                  component="div"
                >
                  🧠 Тренировка устного счёта
                </Typography>
                <Typography
                  variant={isMobile ? "caption" : "body2"}
                  color="text.secondary"
                >
                  Смешанные задачи: сложение, вычитание, умножение и деление с
                  двузначными и трёхзначными числами.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => navigate("/mixed-tasks")}
                >
                  Перейти
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {user && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 6 }}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant={isMobile ? "h6" : "h5"}
                    component="div"
                  >
                    Литература
                  </Typography>
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    color="text.secondary"
                  >
                    Читай классические произведения с закладками и удобным
                    режимом чтения.
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={() => navigate("/literature")}
                  >
                    Перейти
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Stack>
  )
}

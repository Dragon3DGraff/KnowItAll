import { Box, Button, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Equation } from "../multiplicationTable/Equation"
import { Mode, Result, TableItem } from "../types/multiplication.types"
import { Timer } from "../multiplicationTable/Timer"
import { generateMixedTasks } from "../calc/generateMixedTasks"
import { useUser } from "../hooks/useUser"
import { sendResults } from "../api/sendResults"
import { getStatisticsById } from "../api/getStatisticsById"
import { secondsToMin } from "../utils/secondsToMin"
import { calcEstimate } from "../calc/calcEstimate"

export const MixedTasks = () => {
  const [results, setResults] = useState<Result[]>([])
  const [started, setStarted] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)
  const [tasks, setTasks] = useState<TableItem[]>([])
  const { user } = useUser()
  const [mode, setMode] = useState<Mode>(Mode.TRAIN)
  const [sended, setSended] = useState<{
    id: string
    timer: number
  } | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [shared, setShared] = useState<{
    userName: string
    timer?: number
  } | null>(null)
  const [estimate, setEstimate] = useState<number | null>(null)
  const navigate = useNavigate()

  const sharedId = searchParams.get("share")

  const onReplay = useCallback(() => {
    setResults([])
    setFinished(false)
    setTasks([])
    setStarted(false)
    setSended(null)
    setShared(null)
    setEstimate(null)
    navigate("/mixed-tasks")
  }, [navigate])

  useEffect(() => {
    if (sharedId && results.length === 0) {
      getStatisticsById(sharedId).then((res) => {
        if (!("error" in res)) {
          setResults(res.data.results)
          setShared({
            userName: res.userName,
            timer: res.data.mode === Mode.EXAM ? res.data.timer : undefined,
          })
        } else {
          onReplay()
        }
      })
    }
  }, [sharedId, results.length, onReplay])

  const onSolve = (result: Result) => {
    setResults((prev) => {
      if (prev.some((item) => item.id === result.id)) {
        return prev.map((item) => (item.id === result.id ? result : item))
      }
      return [...prev, result]
    })
  }

  const onStart = () => {
    const generated = generateMixedTasks()
    setTasks(generated)
    setStarted(true)
    setResults(
      generated.map((task) => ({
        ...task,
        userAnswer: undefined,
        result: false,
      }))
    )
  }

  const onFinished = () => {
    setFinished(true)
  }

  const surrender = () => {
    onReplay()
    sendResults(0, [], mode, user?.userName)
  }

  const correctCount = results.filter((item) => item.result).length
  const incorrectCount = results.filter((item) => !item.result).length
  const totalSolved = results.length

  useEffect(() => {
    if (user) {
      if (sended) {
        setSearchParams({ share: sended.id })

        const title =
          mode === Mode.EXAM
            ? `Я решил(а) правильно ${correctCount} из ${totalSolved} за ${secondsToMin(
                sended.timer
              )}!`
            : `Я решил(а) правильно ${correctCount} из ${totalSolved}!`

        type YaApi = { share2: (containerId: string, config: unknown) => void }
        const ya = (window as unknown as { Ya?: YaApi }).Ya
        ya?.share2("ya", {
          theme: {
            services:
              "vkontakte,telegram,whatsapp,odnoklassniki,twitter,viber,skype,linkedin,reddit,qzone,renren,sinaWeibo,surfingbird,tencentWeibo",
            bare: false,
            limit: 3,
          },
          content: {
            url: `https://know-it-all.ru/mixed-tasks?share=${sended.id}`,
            title,
          },
        })
      }
    }
  }, [
    sended,
    user,
    correctCount,
    results.length,
    mode,
    setSearchParams,
    totalSolved,
  ])

  const onTimerFinished = async (timer: number) => {
    const totalSolved = results.length
    const estimate = calcEstimate(
      correctCount,
      totalSolved,
      mode === Mode.EXAM ? timer : undefined
    )

    setEstimate(estimate)
    const res = await sendResults(timer, results, mode, user?.userName)

    if (res?.ok) {
      setSended({ id: res.id, timer })
    }
  }

  const onModeChange = () => {
    setMode((prev) => (prev === Mode.EXAM ? Mode.TRAIN : Mode.EXAM))
  }

  const allFilled =
    results.filter((r) => r.userAnswer !== undefined).length === tasks.length

  return (
    <Stack alignItems={"center"} p={0} my={0}>
      <Stack>
        <Typography variant="h5">Тренировка устного счёта</Typography>
        {/* {started && (
          <Timer
            started={started}
            finished={finished}
            mode={mode}
            onFinish={onTimerFinished}
            onTimerStop={onFinished}
          />
        )} */}
      </Stack>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Stack direction={"row"}>
          {(finished || (shared && results)) && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              pl={2}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              <Typography color={"#2e7d32"}>
                Правильно {correctCount}
              </Typography>
              <Typography color={"#FF0000"}>
                Неправильно {incorrectCount}
              </Typography>
              {estimate && (
                <Typography>
                  Оценка: <span style={{ fontWeight: 800 }}>{estimate}</span>
                </Typography>
              )}
              {shared && (
                <Typography>
                  Оценка:{" "}
                  <span style={{ fontWeight: 800 }}>
                    {calcEstimate(correctCount, results.length, shared.timer)}
                  </span>
                </Typography>
              )}
              <Button onClick={onReplay} variant="contained">
                {shared ? "Решу лучше" : "Заново"}
              </Button>
            </Stack>
          )}
        </Stack>

        {/* {!started && !shared && (
          <Stack>
            <Typography variant="h6">{`${
              user?.userName ? user.userName : "Выбери"
            }, тренируемся со счетом`}</Typography>
            <Stack direction={"row"} alignItems={"center"} px={2} gap={2}>
              <Typography>
                {mode === Mode.EXAM ? "Таймер включён" : "Без таймера"}
              </Typography>
              <Switch checked={mode === Mode.EXAM} onChange={onModeChange} />
            </Stack>
          </Stack>
        )} */}
      </Box>

      {shared ? (
        <Stack
          flexWrap={"wrap"}
          mt={1}
          maxHeight={{ xs: "760px", md: "500px", lg: "380px" }}
        >
          {results.map((result, i) => (
            <Equation
              key={result.id}
              id={result.id}
              userAnswer={result.userAnswer}
              number1={result.number1}
              number2={result.number2}
              actionSign={result.actionSign}
              answer={result.answer}
              tabIndex={i}
            />
          ))}
        </Stack>
      ) : started ? (
        <Stack
          flexWrap={"wrap"}
          mt={1}
          //   maxHeight={{ xs: "760px", md: "500px", lg: "380px" }}
        >
          {finished && results.length
            ? results.map((result, i) => (
                <Equation
                  key={result.id}
                  id={result.id}
                  userAnswer={result.userAnswer}
                  number1={result.number1}
                  number2={result.number2}
                  actionSign={result.actionSign}
                  answer={result.answer}
                  tabIndex={i}
                />
              ))
            : tasks.map((tableItem, i) => (
                <Equation
                  key={tableItem.id}
                  id={tableItem.id}
                  userAnswer={undefined}
                  number1={tableItem.number1}
                  number2={tableItem.number2}
                  actionSign={tableItem.actionSign}
                  answer={tableItem.answer}
                  tabIndex={i}
                  isEditable
                  onSolve={onSolve}
                />
              ))}
          {allFilled && !finished && (
            <Box my={1}>
              <Button variant="contained" size="large" onClick={onFinished}>
                Готово!
              </Button>
            </Box>
          )}
          <Box py={1}>
            <div id="ya" />
          </Box>
          {!allFilled && !finished && (
            <Box my={1} mt={"auto"}>
              <Button onClick={surrender} sx={{ width: "fit-content" }}>
                Сдаться
              </Button>
            </Box>
          )}
        </Stack>
      ) : (
        <Box my={2}>
          <Button variant="contained" size="large" onClick={onStart}>
            Начали!
          </Button>
        </Box>
      )}
      {/* <Stack maxWidth={"400px"} mt={2}>
        <img src={nezSrc} />
      </Stack> */}
    </Stack>
  )
}

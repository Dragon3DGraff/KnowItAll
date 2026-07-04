import {
  Alert,
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import { ChangeEvent, useState } from "react"
import { addBook, buildTxtFile } from "../api/addBook"

function a11yProps(index: number) {
  return {
    id: `books-tab-${index}`,
    "aria-controls": `books-tabpanel-${index}`,
  }
}

export const BooksAdmin = () => {
  const [tab, setTab] = useState(0)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [text, setText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    if (!title.trim()) {
      setTitle(file.name.replace(/\.txt$/i, ""))
    }

    event.target.value = ""
  }

  const handleSubmit = async () => {
    setMessage(null)
    setIsSubmitting(true)

    const file = tab === 0 ? buildTxtFile(title, author, text) : selectedFile

    if (!file) {
      setIsSubmitting(false)
      setMessage({ type: "error", text: "Выберите файл .txt" })
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    if (title.trim()) {
      formData.append("title", title.trim())
    }
    if (author.trim()) {
      formData.append("author", author.trim())
    }

    const res = await addBook(formData)

    setIsSubmitting(false)

    if ("error" in res) {
      setMessage({ type: "error", text: res.error })
      return
    }

    setMessage({ type: "success", text: `Книга «${res.title}» добавлена` })
    setTitle("")
    setAuthor("")
    setText("")
    setSelectedFile(null)
  }

  const canSubmit =
    tab === 0
      ? title.trim().length > 0 && text.trim().length > 0
      : selectedFile != null

  return (
    <Stack spacing={2} sx={{ textAlign: "left", py: 2 }}>
      <Typography variant="h6">Добавить книгу</Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Текст" {...a11yProps(0)} />
          <Tab label="Файл .txt" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isSubmitting || !canSubmit}
      >
        {isSubmitting ? "Сохранение..." : "Добавить книгу"}
      </Button>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <TextField
        label="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required={tab === 0}
        fullWidth
        size="small"
        helperText={
          tab === 1
            ? "Необязательно: если указать, файл будет сохранён под этим именем"
            : undefined
        }
      />
      <TextField
        label="Автор"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        fullWidth
        size="small"
      />

      {tab === 0 ? (
        <TextField
          label="Текст книги"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          fullWidth
          multiline
          minRows={12}
        />
      ) : (
        <Stack spacing={1}>
          <Button variant="outlined" component="label" size="small">
            Выбрать файл .txt
            <input
              type="file"
              accept=".txt,text/plain"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" color="text.secondary">
              Файл: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}{" "}
              КБ)
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  )
}

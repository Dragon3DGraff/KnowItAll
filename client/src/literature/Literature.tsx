import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Hourglass } from "react-loader-spinner";
import { getBooks } from "../api/getBooks";
import { useUser } from "../hooks/useUser";
import { BookListItem } from "../types/literature.types";
import { BookList } from "./BookList";

export const Literature = () => {
  const { user } = useUser();
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getBooks()
        .then((res) => {
          if (!("error" in res)) {
            setBooks(res);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <Typography variant="h5">Литература</Typography>
        <Typography variant="h6">
          Доступно только зарегистрированным пользователям
        </Typography>
      </>
    );
  }

  if (isLoading) {
    return (
      <Hourglass
        visible={true}
        height="40"
        width="40"
        ariaLabel="hourglass-loading"
        wrapperStyle={{ margin: "auto" }}
      />
    );
  }

  return (
    <Stack spacing={2} px={1} pb={2} sx={{ textAlign: "left" }}>
      <Typography variant="h5" textAlign="center">
        Литература
      </Typography>
      {books.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          Книги не найдены
        </Typography>
      ) : (
        <BookList books={books} />
      )}
    </Stack>
  );
};

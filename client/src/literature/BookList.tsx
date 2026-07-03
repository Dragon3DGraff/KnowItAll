import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BookListItem } from "../types/literature.types";

type Props = {
  books: BookListItem[];
};

export const BookList = ({ books }: Props) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Grid container spacing={2}>
      {books.map((book) => (
        <Grid item xs={12} sm={6} key={book.id}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 4 }}>
            <CardContent sx={{ textAlign: "left" }}>
              <Typography
                gutterBottom
                variant={isMobile ? "h6" : "h5"}
                component="div"
              >
                {book.title}
              </Typography>
              {book.author && (
                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate(`/literature/${book.id}`)}
              >
                Читать
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { UsersListItem } from "../types/api.types";
import format from "date-fns/format";
import ru from "date-fns/locale/ru";

function Row(props: { row: UsersListItem; onRowClick?: (id: number) => void }) {
  const { row, onRowClick } = props;

  return (
    <TableRow
      onClick={onRowClick ? () => onRowClick(row.id) : undefined}
      hover={Boolean(onRowClick)}
    >
      <TableCell align="center">{row.id}</TableCell>
      <TableCell align="right">{row.userName}</TableCell>
      <TableCell align="right">{row.role}</TableCell>
      <TableCell align="right">{row.solved}</TableCell>
      <TableCell align="right">
        {format(Date.parse(row.registered), "Pp", {
          locale: ru,
        })}
      </TableCell>
    </TableRow>
  );
}

type Props = {
  users: UsersListItem[];
  onRowClick?: (id: number) => void;
};
export const UsersTable = ({ users, onRowClick }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="results table" size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="right">Имя</TableCell>
            <TableCell align="right">Роль</TableCell>
            <TableCell align="right">Решал</TableCell>
            <TableCell align="right">Дата регистрации</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((userInfo) => (
            <Row key={userInfo.id} row={userInfo} onRowClick={onRowClick} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

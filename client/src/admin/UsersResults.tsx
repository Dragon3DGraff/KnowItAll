import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Hourglass } from "react-loader-spinner";
import { StatisticTable } from "../multiplicationTable/StatisticTable";
import { useEffect, useState } from "react";
import { MultiplationsStatistics } from "../types/multiplication.types";
import { AdminInfo } from "../types/api.types";
import { getStatisticsByUserId } from "../api/getStatisticsByUserId";

type Props = {
  info: AdminInfo;
};

export const UsersResults = ({ info }: Props) => {
  const [selectedUser, setSelectedUser] = useState<string>("18");

  const [results, setResults] = useState<MultiplationsStatistics[]>([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setisLoading(true);
      getStatisticsByUserId(selectedUser)
        .then((res) => {
          if (!("error" in res)) {
            setResults(res);
          }
        })
        .finally(() => {
          setisLoading(false);
        });
    }
  }, [selectedUser]);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedUser(event.target.value);
  };
  return (
    <Box>
      <Box sx={{ maxWidth: 350 }} mt={2} mb={-5}>
        <FormControl fullWidth>
          <InputLabel id="currentUser-label">Пользователь</InputLabel>
          <Select
            labelId="currentUser-label"
            id="currentUser"
            value={String(selectedUser)}
            label="Пользователь"
            size="small"
            onChange={handleChange}
          >
            {info?.usersList.map((userInfo) => (
              <MenuItem key={userInfo.id} value={userInfo.id}>
                {userInfo.userName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading && (
        <Hourglass
          visible={true}
          height="40"
          width="40"
          ariaLabel="hourglass-loading"
          wrapperStyle={{ margin: "auto" }}
          wrapperClass=""
          colors={["#306cce", "#72a1ed"]}
        />
      )}
      {results && <StatisticTable results={results} />}
    </Box>
  );
};

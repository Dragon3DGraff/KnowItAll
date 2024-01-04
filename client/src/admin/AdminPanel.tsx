import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { AdminTabItem } from "./AdminTabItem";
import { UsersResults } from "./UsersResults";
import { UsersInfo } from "./UsersInfo";
import { AdminInfo } from "../types/api.types";
import { getStatisticsAll } from "../api/getStatisticsAll";
import { AnonimInfo } from "./AnonimInfo";

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    "aria-controls": `admin-tabpanel-${index}`,
  };
}

export const AdminPanel = () => {
  const { user, isAdmin } = useUser();
  const [info, setInfo] = useState<AdminInfo>();

  const [tab, setTab] = useState(0);

  useEffect(() => {
    user &&
      isAdmin &&
      getStatisticsAll().then((res) => {
        setInfo(res);
      });
  }, [user, isAdmin]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Stack>
      <Typography variant="h5">Админка</Typography>
      {info && (
        <Box sx={{ width: "100%" }}>
          <Box width={"100%"} textAlign={"left"}>
            <Typography>Всего решали {info.resultsCount} раз</Typography>
            <Typography>Сдались {info.surrendeCount} раз</Typography>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label="admin tabs"
            >
              <Tab label="Пользователи" {...a11yProps(0)} />
              <Tab label="Результаты пользователей" {...a11yProps(1)} />
              <Tab label="Статистика анонимов" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <AdminTabItem value={tab} index={0}>
            <UsersInfo info={info} />
          </AdminTabItem>
          <AdminTabItem value={tab} index={1}>
            <UsersResults info={info} />
          </AdminTabItem>
          <AdminTabItem value={tab} index={2}>
            <AnonimInfo info={info} />
          </AdminTabItem>
        </Box>
      )}
    </Stack>
  );
};

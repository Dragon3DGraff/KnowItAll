import { useContext } from "react";
import { UserContext } from "../App";
import { Role } from "../types/api.types";

export const useUser = () => {
  const user = useContext(UserContext);

  const isAdmin = user?.role === Role.ADMIN;

  return { user, isAdmin };
};

import { useMemo } from "react";
import { useSelector } from "react-redux";

const useUsers = () => {
  const usersMap = useSelector((state) => state.data.users);

  const users = useMemo(
    () =>
      Object.entries(usersMap).map(([id, user]) => ({
        id,
        ...user,
      })),
    [usersMap]
  );

  return users;
};

export default useUsers;

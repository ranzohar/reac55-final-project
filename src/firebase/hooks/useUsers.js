import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersData } from "../doc-utils";

const useUsers = (userId) => {
  const dispatch = useDispatch();
  const usersMap = useSelector((state) => state.data.users);

  useEffect(() => {
    console.log(userId);

    if (!userId) return;

    const unsubscribe = getUsersData((data) => {
      dispatch({
        type: "LOAD",
        payload: { users: data },
      });
    });

    return () => unsubscribe();
  }, [userId]);

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

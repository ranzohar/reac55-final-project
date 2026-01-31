import { useSelector } from "react-redux";
import { useEffect } from "react";

function UserSelect({ userId, setUserId }) {
  const users = useSelector((state) => state.admin.users);

  const usersArray = Object.entries(users || {}).map(([id, user]) => ({
    id,
    ...user,
  }));
  const sortedUsersArray = usersArray.sort((a, b) => {
    return a.joinTimestamp - b.joinTimestamp;
  });
  const entries = sortedUsersArray.map((u) => [u.id, u]);
  const defaultKey = entries[0]?.[0];

  useEffect(() => {
    if (!userId || !(userId in (users || {}))) {
      setUserId(defaultKey || "");
    }
  }, [users, setUserId]);

  return (
    <select
      defaultValue={defaultKey || ""}
      onChange={(e) => {
        setUserId(e.target.value);
      }}
      className="user-select"
    >
      {entries.length === 0 ? (
        <option value="" disabled>
          no users available
        </option>
      ) : (
        entries.map(([key, user]) => (
          <option key={key} value={key}>
            {user.fname}
          </option>
        ))
      )}
    </select>
  );
}

export default UserSelect;

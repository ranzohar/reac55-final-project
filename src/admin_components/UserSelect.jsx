import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function UserSelect({ userId, setUserId }) {
  const users = useSelector((state) => state.admin.users);

  const sortedUsers = Object.values(users || {}).sort(
    (a, b) => a.joinTimestamp - b.joinTimestamp,
  );
  const defaultKey = sortedUsers[0]?.username || "";

  useEffect(() => {
    if (!userId || !(userId in (users || {}))) {
      setUserId(defaultKey);
    }
  }, [users, setUserId]);

  return (
    <select
      defaultValue={defaultKey}
      onChange={(e) => {
        setUserId(e.target.value);
      }}
      className="user-select"
    >
      {sortedUsers.length === 0 ? (
        <option value="" disabled>
          no users available
        </option>
      ) : (
        sortedUsers.map((user) => (
          <option key={user.username} value={user.username}>
            {user.fname}
          </option>
        ))
      )}
    </select>
  );
}

export default UserSelect;

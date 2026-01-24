import { useSelector } from "react-redux";
import { useEffect } from "react";

function UserSelect({ userId, setUserId }) {
  const users = useSelector((state) => state.admin.users);

  const entries = Object.entries(users);
  const defaultKey = entries[0]?.[0];

  useEffect(() => {
    if (!userId || !(userId in users)) {
      setUserId(defaultKey || "");
    }
  }, [users, setUserId]);

  return (
    <select
      defaultValue={defaultKey || ""}
      onChange={(e) => {
        setUserId(e.target.value);
      }}
      className="
        bg-white text-black
        dark:bg-gray-800 dark:text-white
        border border-gray-300 dark:border-gray-600
        rounded px-2 py-1
      "
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

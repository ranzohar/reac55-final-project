import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PasswordInput } from "../../components";
import { useParams } from "react-router-dom";
import { updateUserInfo, updateUserPassword } from "../../firebase";

const Account = () => {
  const user = useSelector((state) => state.customer.user);
  const { customerId } = useParams();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [allowOthers, setAllowOthers] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!user) return;
    setFname(user.fname ?? "");
    setLname(user.lname ?? "");
    setUsername(user.username ?? "");
    setAllowOthers(!!user["allow others to see orders"]);
  }, [user]);

  const submitEdit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateUserInfo(customerId, {
        fname,
        lname,
        username,
        "allow others to see orders": allowOthers,
      });

      if (newPassword) {
        if (!currentPassword) {
          throw new Error(
            "Current password is required to change your password.",
          );
        }
        await updateUserPassword(newPassword, currentPassword);
      }

      setSuccess("Account updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message ?? "Failed to update account.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex flex-col max-w-md mx-auto">
      <h3 className="mb-4 text-xl font-semibold">Edit Account Information</h3>
      <form onSubmit={submitEdit} className="flex flex-col gap-4">
        {/* First Name */}
        <div className="flex flex-col">
          <label
            htmlFor="fname"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            First Name
          </label>
          <input
            id="fname"
            type="text"
            className="input-base"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label
            htmlFor="lname"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Last Name
          </label>
          <input
            id="lname"
            type="text"
            className="input-base"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />
        </div>

        {/* Username */}
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            className="input-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Current Password */}
        <div className="flex flex-col">
          <label
            htmlFor="currentPassword"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Current Password (leave empty to keep current)
          </label>
          <PasswordInput
            id="currentPassword"
            value={currentPassword}
            onChange={setCurrentPassword}
            required={false}
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col">
          <label
            htmlFor="newPassword"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            New Password
          </label>
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={setNewPassword}
            required={false}
          />
        </div>

        {/* Allow others checkbox */}
        <label className="inline-flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={allowOthers}
            onChange={(e) => setAllowOthers(e.target.checked)}
          />
          Allow others to see my orders
        </label>

        {/* Error / Success messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full bg-green-700 text-white py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Account;

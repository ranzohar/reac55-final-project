import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PasswordInput from "../../components/PasswordInput";
import { useParams } from "react-router-dom";
import { updateUserInfo, updateUserPassword } from "../../firebase/log-utils";

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
            "Current password is required to change your password."
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
    <div className="flex flex-col">
      <h3>Edit Account Information</h3>
      <form onSubmit={submitEdit}>
        <label>
          <br />
          First Name:
          <br />
          <input
            type="text"
            className="input-base"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </label>

        <label>
          <br />
          Last Name:
          <br />
          <input
            type="text"
            className="input-base"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />
        </label>

        <label>
          <br />
          Username:
          <br />
          <input
            type="text"
            className="input-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          <br />
          Current Password (leave empty to keep current):
          <br />
          <PasswordInput
            value={currentPassword}
            onChange={setCurrentPassword}
            required={false} // explicitly make it optional
          />
        </label>

        <label>
          <br />
          New Password:
          <PasswordInput
            value={newPassword}
            onChange={setNewPassword}
            required={false}
          />
        </label>

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={allowOthers}
            onChange={(e) => setAllowOthers(e.target.checked)}
            required={false} // explicitly make it optional
          />
          Allow others to see my orders
        </label>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

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

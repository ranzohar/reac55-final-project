import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PasswordInput } from "@/components";
import { useParams } from "react-router-dom";
import { updateUserInfo, updateUserPassword } from "@/firebase";
import { ALLOW_OTHERS } from "@/firebase-key-constants";

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
    setAllowOthers(!!user[ALLOW_OTHERS]);
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
        [ALLOW_OTHERS]: allowOthers,
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
    <div className="card-login">
      <form onSubmit={submitEdit}>
        {/* First Name */}
        <label htmlFor="fname">First Name</label>
        <input
          id="fname"
          type="text"
          className="input-base"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        />

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="lname">Last Name</label>
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
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="input-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            readOnly
          />

          {/* <div>
            Changing username requires email verification and is not supported
            from this page.
          </div> */}
        </div>

        {/* Current Password */}
        <div className="flex flex-col">
          <label htmlFor="currentPassword">
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
          <label htmlFor="newPassword">New Password</label>
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={setNewPassword}
            required={false}
          />
        </div>

        {/* Allow others checkbox */}
        <label className="inline">
          <input
            type="checkbox"
            checked={allowOthers}
            id="allowOthers"
            name="allowOthers"
            onChange={(e) => setAllowOthers(e.target.checked)}
          />
          Allow others to see my orders
        </label>

        {/* Error / Success messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Submit */}
        <button type="submit" className="btn-green">
          Save
        </button>
      </form>
    </div>
  );
};

export default Account;

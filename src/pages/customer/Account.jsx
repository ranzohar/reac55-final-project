import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { updateUser, updatePassword } from "@/adapters";
import { ALLOW_OTHERS } from "@/key-constants";
import { PasswordInput } from "@/components";

const AccountForm = ({ user, customerId }) => {
  const dispatch = useDispatch();
  const [fname, setFname] = useState(user.fname || "");
  const [lname, setLname] = useState(user.lname || "");
  const [username, setUsername] = useState(user.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [allowOthers, setAllowOthers] = useState(!!user[ALLOW_OTHERS]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submitEdit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateUser(customerId, {
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
        await updatePassword(newPassword, currentPassword);
      }

      dispatch({
        type: "CUSTOMER_LOAD",
        payload: { user: { ...user, fname, lname, username, [ALLOW_OTHERS]: allowOthers } },
      });
      setSuccess("Account updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message ?? "Failed to update account.");
      setFname(user.fname || "");
      setLname(user.lname || "");
      setUsername(user.username || "");
      setAllowOthers(!!user[ALLOW_OTHERS]);
    }
  };

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

const Account = () => {
  const user = useSelector((state) => state.customer.user);
  const { customerId } = useParams();

  if (!Object.keys(user).length) return <div>Loading...</div>;

  return <AccountForm user={user} customerId={customerId} />;
};

export default Account;

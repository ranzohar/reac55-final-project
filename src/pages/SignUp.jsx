import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordInput } from "@/components";
import { signup, useAuth } from "@/adapters";
import { BACKEND_TYPE } from "@/config/backend";

const SignUp = () => {
  const { user, loading } = useAuth();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [allowOthers, setAllowOthers] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (BACKEND_TYPE === "rest") return; // REST handles navigation directly
    if (!user || loading) return;
    navigate(`/customer/${user.uid}`);
  }, [user, loading, navigate]);

  const submitSignUp = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(
        fname,
        lname,
        username,
        password,
        allowOthers,
      );
      if (BACKEND_TYPE === "rest") {
        navigate(`/customer/${result.uid}`);
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="center-screen">
      <div className="card-login" style={{ "--card-login-max-width": "28rem" }}>
        <h3 className="text-center">New User Registration</h3>
        {/* <div> */}
        <form onSubmit={submitSignUp} className="">
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
          <label htmlFor="lname">Last Name</label>
          <input
            id="lname"
            type="text"
            className="input-base"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />

          {/* Username */}
          <label htmlFor="username">User Name</label>
          <input
            id="username"
            type="text"
            className="input-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password */}
          <label htmlFor="password">Password</label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
          />

          <label className="inline">
            <input
              type="checkbox"
              checked={allowOthers}
              id="allowOthers"
              name="allowOthers"
              onChange={(e) => setAllowOthers(e.target.checked)}
            />
            <span>Allow others to see my orders</span>
          </label>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-blue">
            Create
          </button>

          <Link to="/" className="link-center">
            <span>Back to login page</span>
          </Link>
        </form>
      </div>
      {/* </div> */}
    </div>
  );
};

export default SignUp;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordInput } from "@/components";
import { firebaseSignUp, useAuth } from "@/firebase";

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
    if (!user || loading) return;
    navigate(`/customer/${user.uid}`);
  }, [user, loading, navigate]);

  const submitSignUp = (e) => {
    e.preventDefault();
    firebaseSignUp(fname, lname, username, password, setError, allowOthers);
  };

  return (
    <div className="flex flex-col center-screen">
      <h3 className="mb-4">New User Registration</h3>
      <form onSubmit={submitSignUp} className="flex flex-col gap-4">
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
            User Name
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

        {/* Password */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            checked={allowOthers}
            onChange={(e) => setAllowOthers(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            Allow others to see my orders
          </span>
        </label>

        {error && <div className="error mt-2">{error}</div>}

        <button
          type="submit"
          className="mt-4 bg-green-700 text-white py-2 px-4 rounded"
        >
          Create
        </button>

        <div className="text-center w-50 mt-2">
          <Link to="/" className="text-blue-600 dark:text-blue-400">
            Back to login page
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { firebaseSignUp, useAuth } from "../firebase/log-utils";

const SignUp = () => {
  const { user, loading } = useAuth();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || loading) {
      return;
    }
    navigate(`/${user.uid}`);
  }, [user, loading]);

  const submitSignUp = (e) => {
    e.preventDefault();
    firebaseSignUp(fname, lname, username, password, setError);
  };

  return (
    <div className="flex flex-col center-screen">
      <h3>New User Registration</h3>
      <form onSubmit={submitSignUp}>
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
          User Name:
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
          Password:
          <PasswordInput value={password} onChange={setPassword} />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit">Create</button>
        <br />
        <div className="text-center w-50">
          <Link to="/" className="text-center">
            Back to login page
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

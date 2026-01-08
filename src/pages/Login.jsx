import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { firebaseLogin, checkIfAdmin, useAuth } from "../firebase/log-utils";

const Login = () => {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || loading) {
      return;
    }
    const navigateOnSignIn = async () => {
      if (await checkIfAdmin(user)) {
        navigate(`/admin/${user.uid}`);
      } else {
        navigate(`/${user.uid}`);
      }
      return;
    };
    navigateOnSignIn();
  }, [user, loading]);

  const onSubmitCb = (e) => {
    e.preventDefault();
    firebaseLogin(username, password, setError);
  };

  return (
    <div className="flex flex-col center-screen">
      <h3>Next Generation E-commerce Login</h3>
      <form onSubmit={onSubmitCb}>
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

        <button type="submit">Login</button>
      </form>
      <br />
      New User? <Link to="/signup">Register</Link>
    </div>
  );
};

export default Login;

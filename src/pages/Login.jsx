import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordInput } from "@/components";
import { firebaseLogin, checkIfAdmin, useAuth } from "@/firebase";

const Login = () => {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || loading) return;

    (async () => {
      const path = (await checkIfAdmin(user))
        ? `/admin/${user.uid}`
        : `/customer/${user.uid}`;
      navigate(path);
    })();
  }, [user, loading, navigate]);

  const onSubmitCb = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await firebaseLogin(username.trim(), password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="center-screen">
      <div className="card-login">
        <h3>Next Generation E-commerce</h3>
        <form onSubmit={onSubmitCb}>
          <label htmlFor="username">User Name:</label>
          <input
            id="username"
            type="text"
            className="input-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading} className="btn-blue">
            Login
          </button>
        </form>
        New User? <Link to="/signup">Register</Link>
      </div>
    </div>
  );
};

export default Login;

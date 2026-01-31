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
      <div className="card-login" style={{ "--card-login-max-width": "28rem" }}>
        <h4 className="text-center">Next Generation E-commerce</h4>
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
            className="password-input"
            id="password"
            value={password}
            onChange={setPassword}
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading} className="btn-blue">
            Login
          </button>
        </form>
        <div className="text-center">
          <span>New User?</span> <Link to="/signup">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

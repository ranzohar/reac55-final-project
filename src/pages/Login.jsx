import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { app } from "../firebase/firebase";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const firebaseLogin = async (e) => {
    e.preventDefault();

    const email = username + "@admin.admin";
    const auth = getAuth(app);

    // Sign out the previous user if any
    if (auth.currentUser) {
      await signOut(auth);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Redirect to user-specific page
      navigate(`/${user.uid}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col center-screen">
      <h3>Next Generation E-commerce Login</h3>
      <form onSubmit={firebaseLogin}>
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

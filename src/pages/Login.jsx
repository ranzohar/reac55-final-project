import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const firebaseLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <>
      <h3>Next Generation E-commerse:</h3>
      User Name:
      <br />
      <input
        type="text"
        className="input-base"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <br />
      Password:
      <br />
      <PasswordInput value={password} onChange={setPassword} />
      <button onClick={firebaseLogin}>Login</button>
    </>
  );
};

export default Login;

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { db, app } from "../firebase/firebase";

const SignUp = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const firebaseSignUp = async (e) => {
    e.preventDefault();

    const email = username + "@admin.admin";
    const auth = getAuth(app);
    let user = null;

    // Sign out the previous user if any
    if (auth.currentUser) {
      await signOut(auth);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: user.email.split("@")[0],
        fname,
        lname,
        joined: new Date(),
        ["allow others to see orders"]: true, // TODO - add checkbox
      });

      // Redirect on success
      navigate(`/${user.uid}`);
    } catch (err) {
      setError(err.message);

      if (user) {
        await deleteUser(user);
      }
    }
  };

  return (
    <div className="flex flex-col center-screen">
      <h3>New User Registration</h3>
      <form onSubmit={firebaseSignUp}>
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

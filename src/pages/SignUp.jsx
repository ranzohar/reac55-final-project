import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { db, app } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

const SignUp = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const firebaseSignUp = async () => {
    const email = username + "@admin.admin";
    const auth = getAuth(app);

    let user = null;

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
        ["allow others to see orders"]: true,
      });
    } catch (error) {
      console.error(error.code, error.message);
      if (user) {
        await deleteUser(user);
      }
    }
  };
  return (
    <>
      <h3>New User Registration</h3>
      First Name:
      <br />
      <input
        type="text"
        className="input-base"
        onChange={(e) => {
          setFname(e.target.value);
        }}
      />
      <br />
      Last Name:
      <br />
      <input
        type="text"
        className="input-base"
        onChange={(e) => {
          setLname(e.target.value);
        }}
      />
      <br />
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
      <button onClick={firebaseSignUp}>Create</button>
    </>
  );
};

export default SignUp;

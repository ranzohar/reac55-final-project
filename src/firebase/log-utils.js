import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { db, app } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { removeUser } from "../firebase/doc-utils";

const firebaseLogin = async (username, password, navigate, setError) => {
  const email = username + "@admin.admin";
  const auth = getAuth(app);

  firebaseLogout(auth);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Force refresh token until claims appear
    let tokenResult = await user.getIdTokenResult(true);

    if (!tokenResult.claims.admin) {
      // Sometimes propagation is slightly delayed, retry once after a short wait
      await new Promise((r) => setTimeout(r, 1000)); // wait 1 second
      tokenResult = await user.getIdTokenResult(true);
    }

    if (tokenResult.claims.admin) {
      navigate(`/admin`);
    } else {
      navigate(`/${user.uid}`);
    }
  } catch (err) {
    setError(err.message);
    console.log(err.message);
  }
};

const firebaseLogout = async (authInstance) => {
  const auth = authInstance || getAuth(app);

  if (!auth.currentUser) return;

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

const firebaseSignUp = async (fname, lname, username, navigate, setError) => {
  const email = username + "@admin.admin";
  const auth = getAuth(app);
  let user = null;

  firebaseLogout(auth);

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

    navigate(`/${user.uid}`);
  } catch (err) {
    setError(err.message);

    if (user) {
      await removeUser(user.uid);
    }
  }
};

export { firebaseLogin, firebaseLogout, firebaseSignUp };

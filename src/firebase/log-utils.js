import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db, app } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { removeUser } from "../firebase/doc-utils";
import { useState, useEffect } from "react";

const firebaseLogin = async (username, password, setError) => {
  const email = username + "@admin.admin";
  const auth = getAuth(app);

  await firebaseLogout(auth);

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    setError(err.message);
    console.log(err.message);
  }
};

const checkIfAdmin = async (user) => {
  // Force refresh token until claims appear
  let tokenResult = await user.getIdTokenResult(true);

  if (!tokenResult.claims.admin) {
    // Sometimes propagation is slightly delayed, retry once after a short wait
    await new Promise((r) => setTimeout(r, 1000)); // wait 1 second
    tokenResult = await user.getIdTokenResult(true);
  }

  if (tokenResult.claims.admin) {
    return true;
  } else {
    return false;
  }
};

const firebaseLogout = async (authInstance) => {
  const auth = authInstance || getAuth(app);
  if (!auth) {
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

const firebaseSignUp = async (fname, lname, username, password, setError) => {
  const email = username + "@admin.admin";
  const auth = getAuth(app);
  let user = null;

  await firebaseLogout(auth);

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
  } catch (err) {
    console.log(err);

    setError(err.message);

    if (user) {
      await removeUser(user.uid);
    }
  }
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe;
  }, []);
  return { user, loading };
};

export { firebaseLogin, firebaseLogout, firebaseSignUp, checkIfAdmin, useAuth };

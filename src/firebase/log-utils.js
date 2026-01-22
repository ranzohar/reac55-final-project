import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import useAuth from "./hooks/useAuth";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import { removeUser } from "../firebase/doc-utils";

import { db, app } from "../firebase/firebase";

const firebaseLogin = async (username, password) => {
  const email = username + "@admin.admin";
  const auth = getAuth(app);

  await firebaseLogout(auth);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (err) {
    console.error("Login failed:", err.message);
    throw new Error(err.message || "Login failed");
  }
};

const checkIfAdmin = async (user) => {
  let tokenResult = await user.getIdTokenResult(true);

  if (!tokenResult.claims.admin) {
    await new Promise((r) => setTimeout(r, 1000));
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

const firebaseSignUp = async (
  fname,
  lname,
  username,
  password,
  setError,
  alloOthers,
) => {
  const email = username + "@admin.admin";
  const auth = getAuth(app);
  let user = null;

  await firebaseLogout(auth);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      username: user.email.split("@")[0],
      fname,
      lname,
      joined: new Date(),
      ["allow others to see orders"]: alloOthers,
    });
  } catch (err) {
    console.log(err);

    setError(err.message);

    if (user) {
      await removeUser(user.uid);
    }
  }
};

async function updateUserInfo(uid, data) {
  if (!uid) throw new Error("UID is required");
  if (!data || typeof data !== "object") throw new Error("Data is required");
  console.log(uid);

  const userRef = doc(db, "users", uid);

  try {
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
}

async function updateUserPassword(newPassword, currentPassword) {
  if (!newPassword || newPassword.length < 6)
    throw new Error("Password must be at least 6 characters");

  if (!currentPassword)
    throw new Error("Current password is required to change password");

  try {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("No authenticated user");

    const credential = EmailAuthProvider.credential(
      firebaseUser.email,
      currentPassword,
    );
    await reauthenticateWithCredential(firebaseUser, credential);

    await updatePassword(firebaseUser, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export {
  firebaseLogin,
  firebaseLogout,
  firebaseSignUp,
  checkIfAdmin,
  useAuth,
  updateUserInfo,
  updateUserPassword,
};

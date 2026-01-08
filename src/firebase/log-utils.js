import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../firebase/firebase";

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
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { firebaseLogin, firebaseLogout };

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseLogin, firebaseLogout } from "../auth-utils";
import { store } from "@/redux/store";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      store.dispatch({ type: "RESET_STORE" });
      await firebaseLogin(username, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseLogout();
      store.dispatch({ type: "RESET_STORE" });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout };
};

export default useAuth;

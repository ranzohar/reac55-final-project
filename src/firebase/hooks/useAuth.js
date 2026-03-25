import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseLogin, firebaseLogout } from "../auth-utils";


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

  // Provide login/logout for compatibility with REST useAuth
  const login = async (username, password) => {
    setLoading(true);
    try {
      await firebaseLogin(username, password);
      // user state will be updated by onAuthStateChanged
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseLogout();
      // user state will be updated by onAuthStateChanged
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout };
};

export default useAuth;

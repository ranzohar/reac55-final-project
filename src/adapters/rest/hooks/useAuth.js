import { api } from "../api";
import { store } from "@/redux/store";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicPaths = ["/", "/login", "/signup"];
    if (publicPaths.includes(location.pathname)) return;

    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/user/me");
        setUser(response.data);
      } catch (error) {
        setUser(null);
        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    };
    fetchCurrentUser();
  }, [location.pathname, navigate]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      store.dispatch({ type: "RESET_STORE" });
      const response = await api.post("/user/login", { username, password });
      const data = response.data;
      setUser(data);
      return data;
    } catch (err) {
      if (err.response?.data?.code === "ALREADY_LOGGED_IN") {
        console.warn("Stale login cookie detected — clearing session and retrying login");
        await api.post("/user/logout", {});
        try {
          const response = await api.post("/user/login", { username, password });
          const data = response.data;
          setUser(data);
          return data;
        } catch (retryErr) {
          setUser(null);
          throw retryErr;
        }
      }
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/user/logout", {});
      setUser(null);
      store.dispatch({ type: "RESET_STORE" });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout };
};

export default useAuth;

import { api } from "../api";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip session check on public pages (login, signup, home)
    const publicPaths = ["/", "/login", "/signup"];
    if (publicPaths.includes(location.pathname)) {
      setUser(null);
      return;
    }

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
      const response = await api.post("/user/login", { username, password });
      const data = response.data;
      console.log("User:", data);
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setUser(null);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/user/logout", {});
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout };
};

export default useAuth;

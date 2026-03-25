import axios from "axios";
import { BACKEND_CONFIG } from "@/config/backend";

import { useState } from "react";

// Create axios instance with REST API base URL
const api = axios.create({
  baseURL: BACKEND_CONFIG.rest.baseUrl,
  withCredentials: true,
});

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post("/user/login", { username, password });
      const data = response.data;
      setUser(data.user || { username });
      setLoading(false);
      return data;
    } catch (err) {
      setUser(null);
      setLoading(false);
      throw err;
    }
  };

  // REST logout: clears user
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

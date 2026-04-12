// REST Auth Adapter
import useAuth from "./hooks/useAuth";
import { api } from "./api";
import { ALLOW_OTHERS } from "@/key-constants";

export const restAuthAdapter = {
  logout: async () => {
    await api.post("/user/logout", {});
  },
  signup: async (fname, lname, username, password, allowOthers) => {
    const doSignup = () =>
      api.post("/user/signup", { fname, lname, username, password, allowOthersToSeeMyOrders: allowOthers });
    try {
      const response = await doSignup();
      return response.data;
    } catch (error) {
      if (error.response?.data?.code === "ALREADY_LOGGED_IN") {
        console.warn("Stale login cookie detected — clearing session and retrying signup");
        await api.post("/user/logout", {});
        try {
          const response = await doSignup();
          return response.data;
        } catch (retryErr) {
          const message =
            retryErr.response?.data?.message || retryErr.message || "Signup failed";
          throw new Error(message);
        }
      }
      const message =
        error.response?.data?.message || error.message || "Signup failed";
      throw new Error(message);
    }
  },
  isAdmin: (user) => {
    if (!user || typeof user !== "object") {
      throw new Error("User object is required");
    }
    return Boolean(user.isAdmin);
  },
  updateUser: async (uid, data) => {
    try {
      const { [ALLOW_OTHERS]: allowOthers, ...rest } = data;
      const payload = allowOthers !== undefined ? { ...rest, allowOthersToSeeMyOrders: allowOthers } : rest;
      const response = await api.patch("/user", payload);
      return response.data.updatedUser;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Update user info failed";
      throw new Error(message);
    }
  },
  updatePassword: async (newPassword, currentPassword) => {
    if (!newPassword || newPassword.length < 6)
      throw new Error("Password must be at least 6 characters");

    if (!currentPassword)
      throw new Error("Current password is required to change password");

    try {
      const response = await api.patch("/user", {
        password: newPassword,
        currentPassword,
      });
      return response.data.updatedUser;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Update password failed";
      throw new Error(message);
    }
  },
};

export { useAuth };

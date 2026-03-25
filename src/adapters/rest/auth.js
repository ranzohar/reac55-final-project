// REST Auth Adapter
import useAuth from "./hooks/useAuth";
import { api } from "./api";

export const restAuthAdapter = {
  signup: async (fname, lname, username, password, allowOthers) => {
    try {
      const response = await api.post("/user/signup", {
        fname,
        lname,
        username,
        password,
        allowOthers,
      });
      return response.data;
    } catch (error) {
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
      const response = await api.patch("/user", data);
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

// REST Auth Adapter
import useAuth from "./hooks/useAuth";

export const restAuthAdapter = {
  signup: () => {
    throw new Error("REST signup not implemented yet");
  },
  isAdmin: () => {
    throw new Error("REST isAdmin not implemented yet");
  },
  updateUserInfo: () => {
    throw new Error("REST updateUserInfo not implemented yet");
  },
  updateUserPassword: () => {
    throw new Error("REST updateUserPassword not implemented yet");
  },
};

export { useAuth };

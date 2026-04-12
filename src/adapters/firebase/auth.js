// Firebase Auth Adapter
import {
  firebaseLogin,
  firebaseLogout,
  firebaseSignUp,
  checkIfAdmin,
  updateUserInfo,
  updateUserPassword,
} from "../../firebase/auth-utils";

export const firebaseAuthAdapter = {
  signup: firebaseSignUp,
  isAdmin: checkIfAdmin,
  updateUser: updateUserInfo,
  updatePassword: updateUserPassword,
  logout: firebaseLogout,
};

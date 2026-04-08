import { BACKEND_TYPE } from "@/config/backend";
import { firebaseAuthAdapter } from "./firebase/auth";
import { restAuthAdapter, useAuth as restUseAuth } from "./rest/auth";
import { firebaseDataAdapter } from "./firebase/data";
import { restDataAdapter } from "./rest/data";
import useFirebaseAuth from "../firebase/hooks/useAuth";
export { useCategories } from "./hooks/useCategories";
export { useProducts } from "./hooks/useProducts";

const selectedAuthAdapter =
  BACKEND_TYPE === "firebase" ? firebaseAuthAdapter : restAuthAdapter;
const selectedDataAdapter =
  BACKEND_TYPE === "firebase" ? firebaseDataAdapter : restDataAdapter;

const useAuth = BACKEND_TYPE === "firebase" ? useFirebaseAuth : restUseAuth;

export { useAuth };

export const { isAdmin, signup, updateUser, updatePassword } =
  selectedAuthAdapter;

export const {
  getCategories,
  addCategory,
  updateCategory,
  removeCategory,
  getProducts,
  upsertProduct,
  getUsers,
  getUser,
  getOrders,
  getAllOrders,
  getPublicOrders,
  addOrder,
} = selectedDataAdapter;

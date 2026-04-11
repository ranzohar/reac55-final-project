import { BACKEND_TYPE } from "@/config/backend";
export { useCategories } from "./hooks/useCategories";
export { useProducts } from "./hooks/useProducts";

// Dynamic imports ensure Firebase is never loaded when using the REST backend.
// Static imports would execute firebase.js (initializeApp + getFirestore) eagerly,
// opening a persistent Firestore connection even when it isn't needed.
let selectedAuthAdapter, selectedDataAdapter, selectedUseAuth;

if (BACKEND_TYPE === "firebase") {
  const { firebaseAuthAdapter } = await import("./firebase/auth");
  const { firebaseDataAdapter } = await import("./firebase/data");
  const { default: useFirebaseAuth } = await import("../firebase/hooks/useAuth");
  selectedAuthAdapter = firebaseAuthAdapter;
  selectedDataAdapter = firebaseDataAdapter;
  selectedUseAuth = useFirebaseAuth;
} else {
  const { restAuthAdapter, useAuth: restUseAuth } = await import("./rest/auth");
  const { restDataAdapter } = await import("./rest/data");
  selectedAuthAdapter = restAuthAdapter;
  selectedDataAdapter = restDataAdapter;
  selectedUseAuth = restUseAuth;
}

export const useAuth = selectedUseAuth;
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
  getProductStats,
  getStatsByUser,
} = selectedDataAdapter;

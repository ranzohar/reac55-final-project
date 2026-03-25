// data.js for firebase serverless backend
// Import relevant data adapter functions for use in index.js

// TODO - add get orders (as an aggregation from user orders)
const notImplemented = () => {
  throw new Error("Firebase data adapter not implemented yet");
};

import {
  getCategories,
  addCategory,
  updateCategory,
  removeCategory,
  getUsersData as getUsers,
  getUser,
  getProductsData as getProducts,
  upsertProduct,
  addOrderToUser as addOrder,
} from "@/firebase/doc-utils";

export const firebaseDataAdapter = {
  getCategories,
  addCategory,
  updateCategory,
  getProducts,
  upsertProduct,
  removeCategory,
  getUsers,
  getUser,
  getOrders: notImplemented,
  addOrder,
};

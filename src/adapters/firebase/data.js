// data.js for firebase serverless backend
// Import relevant data adapter functions for use in index.js

import {
  getCategories,
  addCategory,
  updateCategory,
  removeCategory,
  getUsersData as getUsers,
  getUser,
  getOrders,
  getAllOrders,
  getPublicOrders,
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
  getOrders,
  getAllOrders,
  getPublicOrders,
  addOrder,
};

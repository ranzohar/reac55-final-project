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
  createProduct,
  updateProduct,
  deleteProduct,
  addOrderToUser as addOrder,
  getProductStats,
  getOrdersForProduct,
  getStatsByUser,
} from "@/firebase/doc-utils";

export const firebaseDataAdapter = {
  getCategories,
  addCategory,
  updateCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  removeCategory,
  getUsers,
  getUser,
  getOrders,
  getAllOrders,
  getPublicOrders,
  addOrder,
  getProductStats,
  getOrdersForProduct,
  getStatsByUser,
};

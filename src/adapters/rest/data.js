// REST Data Adapter (not implemented)
const notImplemented = () => {
  throw new Error("REST data adapter not implemented yet");
};

export const restDataAdapter = {
  getCategories: notImplemented,
  addCategory: notImplemented,
  updateCategory: notImplemented,
  removeCategory: notImplemented,
  getProducts: notImplemented,
  upsertProduct: notImplemented,
  getUsers: notImplemented,
  getUser: notImplemented,
  updateUser: notImplemented,
  getOrders: notImplemented,
  addOrder: notImplemented,
};

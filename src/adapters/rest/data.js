// REST Data Adapter (not implemented)
import { api } from "./api";

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
  getUser: (uid, setCB) => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
        setCB(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setCB(null);
      }
    };
    fetchUser();
    return () => {}; // TODO - implement socket subcription for real-time updates and unsubscription
  },
  updateUser: notImplemented,
  getOrders: notImplemented,
  addOrder: notImplemented,
};

// REST Data Adapter (not implemented)
import { api } from "./api";

const notImplemented = () => {
  throw new Error("REST data adapter not implemented yet");
};

export const restDataAdapter = {
  getCategories: (setCB) => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category/");
        setCB(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCB(null);
      }
    };
    fetchCategories();
    return () => {}; // TODO - implement socket subscription for real-time updates and unsubscription
  },
  addCategory: async (name) => {
    const response = await api.post("/category/", { name });
    return response.data.category;
  },
  updateCategory: async (id, name) => {
    const response = await api.patch(`/category/${id}`, { name });
    return response.data.category;
  },
  removeCategory: async (id) => {
    const response = await api.delete(`/category/${id}`);
    return response.data.categoryId;
  },
  getProducts: (setCB) => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/");
        setCB(response.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setCB(null);
      }
    };
    fetchProducts();
    return () => {};
  },
  upsertProduct: async (fields) => {
    const { title, price, description, category } = fields;
    await api.post("/product/", { title, price, description, category });
  },
  getUsers: (setCB) => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/list");
        setCB(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setCB(null);
      }
    };
    fetchUsers();
    return () => {};
  },
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

import { api } from "./api";
import { ALLOW_OTHERS } from "@/key-constants";

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
  updateCategory: async (name, newName) => {
    const response = await api.patch(`/category/${encodeURIComponent(name)}`, { name: newName });
    return response.data.category;
  },
  removeCategory: async (name) => {
    const response = await api.delete(`/category/${encodeURIComponent(name)}`);
    return response.data.name;
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
        setCB({ ...response.data, [ALLOW_OTHERS]: response.data.allowOthersToSeeMyOrders });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setCB(null);
      }
    };
    fetchUser();
    return () => {};
  },
  getPublicOrders: (setCB) => {
    const fetchPublicOrders = async () => {
      try {
        const response = await api.get("/order/public");
        setCB([response.data]);
      } catch (error) {
        console.error("Failed to fetch public orders:", error);
        setCB([]);
      }
    };
    fetchPublicOrders();
    return () => {};
  },
  getOrders: (uid, setCB) => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/order/");
        setCB(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setCB([]);
      }
    };
    fetchOrders();
    return () => {};
  },
  getAllOrders: (setCB) => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/order/all");
        setCB(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch all orders:", error);
        setCB([]);
      }
    };
    fetchOrders();
    return () => {};
  },
  addOrder: async (uid, orderData) => {
    await api.post(`/order`, orderData);
  },
  getProductStats: (setCB) => {
    const fetchProductStats = async () => {
      try {
        const response = await api.get("/order/stats/products");
        setCB(response.data);
      } catch (error) {
        console.error("Failed to fetch product stats:", error);
        setCB([]);
      }
    };
    fetchProductStats();
    return () => {};
  },
  getStatsByUser: (username, setCB) => {
    const fetchStatsByUser = async () => {
      try {
        const response = await api.get(`/order/stats/user/${encodeURIComponent(username)}`);
        const data = Object.entries(response.data).map(([name, value]) => ({ name, value }));
        setCB(data);
      } catch (error) {
        console.error("Failed to fetch stats by user:", error);
        setCB([]);
      }
    };
    fetchStatsByUser();
    return () => {};
  },
};

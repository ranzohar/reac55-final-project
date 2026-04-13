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
    return () => {};
  },
  addCategory: async (name) => {
    const response = await api.post("/category/", { name });
    return response.data.category;
  },
  updateCategory: async (id, newName) => {
    const response = await api.patch(`/category/${encodeURIComponent(id)}`, {
      name: newName,
    });
    return response.data.category;
  },
  removeCategory: async (id) => {
    const response = await api.delete(`/category/${encodeURIComponent(id)}`);
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
  createProduct: async (fields) => {
    const { title, price, description, categoryId } = fields;
    console.log("Creating product with fields:", fields);

    const response = await api.post("/product/", {
      title,
      price,
      description,
      categoryId,
    });
    return response.data.product;
  },
  updateProduct: async (id, fields) => {
    console.log("Updating product with id:", id, "and fields:", fields);
    const { title, price, description, categoryId } = fields;
    await api.patch(`/product/${encodeURIComponent(id)}`, {
      title,
      price,
      description,
      categoryId,
    });
  },
  deleteProduct: async (id) => {
    await api.delete(`/product/${encodeURIComponent(id)}`);
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
        setCB({
          ...response.data,
          [ALLOW_OTHERS]: response.data.allowOthersToSeeMyOrders,
        });
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
  getOrdersForProduct: (title, setCB) => {
    const fetch = async () => {
      try {
        const response = await api.get(
          `/order/stats/product/${encodeURIComponent(title)}`,
        );
        setCB(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch orders for product:", error);
        setCB([]);
      }
    };
    fetch();
    return () => {};
  },
  getStatsByUser: (username, setCB) => {
    const fetchStatsByUser = async () => {
      try {
        console.log("Fetching stats for user:", username);
        const response = await api.get(
          `/order/stats/user/${encodeURIComponent(username)}`,
        );
        const data = Object.entries(response.data).map(([name, value]) => ({
          name,
          value,
        }));
        console.log("Fetched stats by user:", data);
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

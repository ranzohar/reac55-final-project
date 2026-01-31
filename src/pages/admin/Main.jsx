import { Outlet } from "react-router-dom";
import { LinksTab } from "@/components";
import { useEffect } from "react";
import { getUsersData, getCategoriesData, loadProductsOnce } from "@/firebase";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { adminId } = useParams();

  useEffect(() => {
    const unsubscribeUsers = getUsersData((data) => {
      dispatch({ type: "LOAD_USERS", payload: { users: data } });
    });
    const unsubscribeCategories = getCategoriesData((data) =>
      dispatch({ type: "LOAD", payload: { categories: data } }),
    );

    // Load products once without subscribing to realtime updates
    // This prevents re-rendering when admin saves products
    loadProductsOnce().then((productsData) => {
      dispatch({ type: "LOAD", payload: { products: productsData } });
    });

    const unsubscribes = [unsubscribeUsers, unsubscribeCategories];
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, [adminId, dispatch]);

  const links = [
    { name: "Categories", path: "categories" },
    { name: "Products", path: "products" },
    { name: "Customers", path: "customers" },
    { name: "Statistics", path: "statistics" },
  ];

  return (
    <div className="card">
      <h3 className="text-center">Hello, Admin</h3>
      <LinksTab items={links} />
      <Outlet />
    </div>
  );
};

export default AdminPage;

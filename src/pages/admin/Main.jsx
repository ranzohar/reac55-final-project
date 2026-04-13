import React from "react";

import { Outlet } from "react-router-dom";
import { CurrencyOverlay, LinksTab, Spinner } from "@/components";
import { useEffect, useState } from "react";
import { getUsers, getAllOrders, getCategories, getProducts } from "@/adapters";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { adminId } = useParams();
  const [loadedFlags, setLoadedFlags] = useState({
    users: false,
    orders: false,
    categories: false,
    products: false,
  });
  const isLoading = !Object.values(loadedFlags).every(Boolean);
  const markLoaded = (key) =>
    setLoadedFlags((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  useEffect(() => {
    const unsubscribeUsers = getUsers((data) => {
      dispatch({ type: "LOAD_USERS", payload: { users: data } });
      markLoaded("users");
    });
    const unsubscribeOrders = getAllOrders((data) => {
      dispatch({ type: "LOAD_ORDERS", payload: data });
      markLoaded("orders");
    });
    const unsubscribeCategories = getCategories((data) => {
      dispatch({ type: "LOAD", payload: { categories: data } });
      markLoaded("categories");
    });
    const unsubscribeProducts = getProducts((data) => {
      dispatch({ type: "LOAD", payload: { products: data } });
      markLoaded("products");
    });

    const unsubscribes = [unsubscribeUsers, unsubscribeOrders, unsubscribeCategories, unsubscribeProducts];
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, [adminId, dispatch]);

  if (isLoading) return <Spinner />;

  const links = [
    { name: "Categories", path: "categories" },
    { name: "Products", path: "products" },
    { name: "Customers", path: "customers" },
    { name: "Statistics", path: "statistics" },
  ];

  return (
    <CurrencyOverlay>
      <div className="card-main">
        <h4 className="text-center">Hello, Admin</h4>
        <LinksTab items={links} />
        <Outlet context={{ isLoading: false }} />
      </div>
    </CurrencyOverlay>
  );
};

export default AdminPage;

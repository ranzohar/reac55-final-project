import React from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";

import { Cart, SlidingWindow } from "@/customer_components";
import { useEffect, useState } from "react";
import {
  getUser,
  getProducts,
  getCategories,
  getOrders,
  getPublicOrders,
  logout,
} from "@/adapters";
import { CurrencyOverlay, LinksTab, Spinner } from "@/components";
import { useDispatch, useSelector } from "react-redux";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerId } = useParams();
  const user = useSelector((state) => state.customer.user);
  const [loadedFlags, setLoadedFlags] = useState({
    user: false,
    products: false,
    categories: false,
    orders: false,
    publicOrders: false,
  });
  const isLoading = !Object.values(loadedFlags).every(Boolean);
  const markLoaded = (key) =>
    setLoadedFlags((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  // Fetch and listen to user data changes
  useEffect(() => {
    const unsubscribeUser = getUser(customerId, async (data) => {
      if (data === null) {
        await logout();
        navigate("/login");
        return;
      }
      dispatch({ type: "CUSTOMER_LOAD", payload: { user: data } });
      markLoaded("user");
    });
    const unsubscribeProducts = getProducts((data) => {
      dispatch({ type: "LOAD", payload: { products: data } });
      markLoaded("products");
    });
    const unsubscribeCategories = getCategories((data) => {
      dispatch({ type: "LOAD", payload: { categories: data } });
      markLoaded("categories");
    });
    const unsubscribeOrders = getOrders(customerId, (data) => {
      dispatch({ type: "CUSTOMER_LOAD", payload: { orders: data } });
      markLoaded("orders");
    });
    const unsubscribePublicOrders = getPublicOrders((data) => {
      const { id, ...totals } = data[0] ?? {};
      dispatch({ type: "CUSTOMER_LOAD", payload: { publicOrders: totals } });
      markLoaded("publicOrders");
    });
    return () => {
      unsubscribeUser && unsubscribeUser();
      unsubscribeProducts && unsubscribeProducts();
      unsubscribeCategories && unsubscribeCategories();
      unsubscribeOrders && unsubscribeOrders();
      unsubscribePublicOrders && unsubscribePublicOrders();
    };
  }, [customerId, dispatch]);

  if (isLoading) return <Spinner />;

  const links = [
    { name: "Products", path: "products" },
    { name: "My Orders", path: "orders" },
    { name: "My Account", path: "account" },
  ];
  return (
    <CurrencyOverlay>
      <SlidingWindow component={<Cart />}>
        <div className="card-main">
          <h4 className="text-center">Hello, {user.fname}</h4>
          <LinksTab items={links} />
          <Outlet />
        </div>
      </SlidingWindow>
    </CurrencyOverlay>
  );
};

export default CustomerPage;

import React from "react";
import { useParams, Outlet } from "react-router-dom";

import { Cart, SlidingWindow } from "@/customer_components";
import { useEffect } from "react";
// import {
//   getUser,
//   getProductsData,
//   getCategoriesData,
//   getPublicOrders,
// } from "@/firebase";
import { getUser, getProducts, getCategories } from "@/adapters";
import { CurrencyOverlay, LinksTab } from "@/components";
import { useDispatch, useSelector } from "react-redux";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const user = useSelector((state) => state.customer.user);

  // Fetch and listen to user data changes
  useEffect(() => {
    console.log("Get user is called for customerId:", customerId);
    const unsubscribeUser = getUser(customerId, (data) => {
      dispatch({ type: "CUSTOMER_LOAD", payload: { user: data } });
    });
    const unsubscribeProducts = getProducts((data) =>
      dispatch({ type: "LOAD", payload: { products: data } }),
    );
    const unsubscribeCategories = getCategories((data) =>
      dispatch({ type: "LOAD", payload: { categories: data } }),
    );
    return () => {
      unsubscribeUser && unsubscribeUser();
      unsubscribeProducts && unsubscribeProducts();
      unsubscribeCategories && unsubscribeCategories();
    };
  }, [customerId, dispatch]);

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

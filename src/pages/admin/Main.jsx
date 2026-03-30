import React from "react";

import { Outlet } from "react-router-dom";
import { CurrencyOverlay, LinksTab } from "@/components";
import { useEffect } from "react";
import { getUsers, getCategories } from "@/adapters";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { adminId } = useParams();

  useEffect(() => {
    const unsubscribeUsers = getUsers((data) => {
      dispatch({ type: "LOAD_USERS", payload: { users: data } });
    });
    const unsubscribeCategories = getCategories((data) =>
      dispatch({ type: "LOAD", payload: { categories: data } }),
    );

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
    <CurrencyOverlay>
      <div className="card-main">
        <h4 className="text-center">Hello, Admin</h4>
        <LinksTab items={links} />
        <Outlet />
      </div>
    </CurrencyOverlay>
  );
};

export default AdminPage;

import "./App.css";

import { Routes, Route, Navigate } from "react-router";
import WebpageTable from "./components/WebpageTable";
import {
  getUsersData,
  getOrdersData,
  getCategoriesData,
  getProductsData,
} from "./firebase/firebase-utils";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminStatistics from "./pages/admin/Statistics";
import AdminMain from "./pages/admin/Main";
import AdminCategories from "./pages/admin/Categories";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";
import CustomerMain from "./pages/customer/Main";
import CustomerOrders from "./pages/customer/Orders";
import CustomerProducts from "./pages/customer/Products";
import CustomerDetails from "./pages/customer/Details";

function App() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const data = useSelector((state) => state.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users.length > 0) {
      dispatch({
        type: "LOAD",
        payload: { users, orders, categories, products },
      });
    }
    console.log(data);
  }, [users, orders, categories, products]);

  const getDataTest = async () => {
    getUsersData(setUsers);
    getOrdersData(setOrders);
    getCategoriesData(setCategories);
    getProductsData(setProducts);
  };

  return (
    <>
      {/* <div className="w-screen flex justify-center mt-4">
        <button onClick={getDataTest} className="mx-2">
          get data
        </button>
      </div> */}

      <Routes>
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/admin" element={<AdminMain />}>
          <Route index element={<Navigate to="categories" replace />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="Users" element={<AdminUsers />} />
        </Route>

        <Route path="/:customerId" element={<CustomerMain />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<CustomerProducts />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="details" element={<CustomerDetails />} />
        </Route>

        <Route
          path="test_table"
          element={
            <WebpageTable
              headers={["h1", "h2", "h3"]}
              data={[
                ["1", "2", "3"],
                ["4", "5", "6"],
              ]}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;

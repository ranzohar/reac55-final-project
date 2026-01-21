import "./App.css";

import { Routes, Route, Navigate } from "react-router";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminMain from "./pages/admin/Main";
import AdminCategories from "./pages/admin/Categories";
import AdminProducts from "./pages/admin/Products";
import AdminStatistics from "./pages/admin/Statistics";
import AdminCustomers from "./pages/admin/Customers";
import CustomerMain from "./pages/customer/Main";
import CustomerProducts from "./pages/customer/Products";
import CustomerOrders from "./pages/customer/Orders";
import CustomerAccountDetails from "./pages/customer/Account";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/admin/:adminId" element={<AdminMain />}>
        <Route index element={<Navigate to="categories" replace />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="statistics" element={<AdminStatistics />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>

      <Route path="/customer/:customerId" element={<CustomerMain />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<CustomerProducts />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="account" element={<CustomerAccountDetails />} />
      </Route>
    </Routes>
  );
}

export default App;

import "./App.css";
import Cart from "./customer_components/Cart";
import ProductsBarChart from "./admin_components/ProductBarChart";
import ProductsPieChart from "./admin_components/ProductsPieChart";
import SlidingWindow from "./customer_components/SlidingWindow";
import { Routes, Route } from "react-router";
import WebpageTable from "./components/WebpageTable";
import {
  getUsersData,
  getOrdersData,
  getCategoriesData,
  getProductsData,
} from "./firebase/firebase-utils";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Categories from "./admin_components/Categories";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

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
      <div className="w-screen flex justify-center mt-4">
        <button onClick={getDataTest} className="mx-2">
          get data
        </button>
      </div>

      <Routes>
        <Route path="/" element={<SlidingWindow component={<Cart />} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/charts"
            element={
              <>
                <ProductsPieChart /> <ProductsBarChart />
              </>
            }
          />
          <Route path="/categories" element={<Categories />} />
          <Route
            path="/table"
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
        </Route>
      </Routes>
    </>
  );
}

export default App;

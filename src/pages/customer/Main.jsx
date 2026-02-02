import { Cart, SlidingWindow } from "@/customer_components";
import { useParams, Outlet } from "react-router-dom";
import { useEffect } from "react";
import {
  getUser,
  getProductsData,
  getCategoriesData,
  getPublicOrders,
} from "@/firebase";
import { CurrencyOverlay, LinksTab } from "@/components";
import { useDispatch, useSelector } from "react-redux";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const user = useSelector((state) => state.customer.user);

  useEffect(() => {
    const unsubscribeUser = getUser(customerId, (data) => {
      dispatch({ type: "CUSTOMER_LOAD", payload: { user: data } });
    });
    const unsubscribePublicOrders = getPublicOrders((data) => {
      dispatch({
        type: "CUSTOMER_LOAD",
        payload: { publicOrders: data[0] },
      });
    });
    const unsubscribeCategories = getCategoriesData((data) =>
      dispatch({ type: "LOAD", payload: { categories: data } }),
    );
    const unsubscribeProducts = getProductsData((data) =>
      dispatch({ type: "LOAD", payload: { products: data } }),
    );
    const ubsubscribes = [
      unsubscribeUser,
      unsubscribePublicOrders,
      unsubscribeProducts,
      unsubscribeCategories,
    ];
    return () => ubsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [customerId]);

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

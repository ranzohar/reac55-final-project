import { Outlet } from "react-router-dom";
import LinksTab from "../../components/LinksTab";
import { useEffect } from "react";
import {
  getUsersData,
  getCategoriesData,
  getProductsData,
} from "../../firebase/doc-utils";
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
      dispatch({ type: "LOAD", payload: { categories: data } })
    );
    const unsubscribeProducts = getProductsData((data) =>
      dispatch({ type: "LOAD", payload: { products: data } })
    );
    const unsubscribes = [
      unsubscribeUsers,
      unsubscribeCategories,
      unsubscribeProducts,
    ];
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, [adminId, dispatch]);

  const links = [
    { name: "Categories", path: "categories" },
    { name: "Products", path: "products" },
    { name: "Customers", path: "users" },
    { name: "Statistics", path: "statistics" },
  ];

  return (
    <div className="shrink-0 p-4 flex flex-col items-center">
      <div className="shrink-0 p-4 ">
        <h3>Hello, Admin</h3>
        <div className="my-2">
          <LinksTab items={links} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;

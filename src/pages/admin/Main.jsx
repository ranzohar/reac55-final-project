import { Outlet } from "react-router-dom";
import LinksTab from "../../components/LinksTab";

const AdmingPage = () => {
  const links = [
    { name: "Categories", path: "categories" },
    { name: "Products", path: "products" },
    { name: "Customers", path: "users" },
    { name: "Statistics", path: "statistics" },
  ];
  return (
    <div className="flex flex-col center-screen">
      <h3>Hello, Admin</h3>
      <br />
      <LinksTab items={links} />
      <Outlet />
    </div>
  );
};

export default AdmingPage;

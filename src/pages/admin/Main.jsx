import { Outlet } from "react-router-dom";
import LinksTab from "../../components/LinksTab";

const AdminPage = () => {
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

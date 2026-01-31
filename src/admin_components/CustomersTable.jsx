import { useMemo } from "react";
import { useSelector } from "react-redux";

import { WebpageTable } from "../components";

const CustomersTable = () => {
  const usersMap = useSelector((state) => state.admin.users);
  const orders = useSelector((state) => state.admin.orders);
  const products = useSelector((state) => state.data.products);
  const tableData = useMemo(() => {
    if (!usersMap || Object.keys(usersMap).length === 0) return [];
    const ordersPerUser = {};

    orders.forEach((order) => {
      ordersPerUser[order.userId] = [
        ...(ordersPerUser[order.userId] || []),
        order,
      ];
    });

    const usersArray = Object.entries(usersMap).map(([id, user]) => ({
      id,
      ...user,
    }));
    return usersArray?.map((user) => {
      const userOrders = ordersPerUser[user.id];
      const ordersTableData = userOrders?.flatMap((order) => {
        return order.products.map((orderedProduct) => {
          return [
            products[orderedProduct.id]?.title,
            orderedProduct.quantity,
            order.date,
          ];
        });
      });
      let ordersTable;
      if (ordersTableData && ordersTableData.length > 0) {
        ordersTable = (
          <WebpageTable
            headers={["Product", "Qty", "Date"]}
            data={ordersTableData}
            striped={true}
          />
        );
      } else {
        ordersTable = <div className="text-gray-500">no orders yet</div>;
      }
      return [`${user.fname} ${user.lname}`, user.joinDate, ordersTable];
    });
  }, [usersMap, orders, products]);

  if (!tableData.length)
    return (
      <div className="p-6 text-center text-gray-500">No customers yet</div>
    );

  return (
    <WebpageTable
      className="background-3"
      headers={["Full Name", "Joined At", "Products Bought"]}
      data={tableData}
    />
  );
};

export default CustomersTable;

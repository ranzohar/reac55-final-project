import { useMemo } from "react";
import { useSelector } from "react-redux";

import { WebpageTable } from "../components";

const CustomersTable = () => {
  const usersMap = useSelector((state) => state.admin.users);
  const orders = useSelector((state) => state.admin.orders);
  const products = useSelector((state) => state.data.products);

  const tableData = useMemo(() => {
    if (!usersMap || usersMap.size === 0) return [];
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
    const sortedUsersArray = usersArray.sort((a, b) => {
      const [dA, mA, yA] = a.joinDate.split("/").map(Number);
      const [dB, mB, yB] = b.joinDate.split("/").map(Number);

      return new Date(yA, mA - 1, dA) - new Date(yB, mB - 1, dB);
    });
    return sortedUsersArray?.map((user) => {
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
      let ordersTable = [];
      if (ordersTableData) {
        ordersTable = (
          <WebpageTable
            headers={["Product", "Qty", "Date"]}
            data={ordersTableData || []}
          />
        );
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
      headers={["Full Name", "Joined At", "Products Bought"]}
      data={tableData}
    />
  );
};

export default CustomersTable;

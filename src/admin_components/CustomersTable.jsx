import React from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { WebpageTable } from "@/components";

const CustomersTable = () => {
  const usersMap = useSelector((state) => state.admin.users);
  const orders = useSelector((state) => state.admin.orders);
  const tableData = useMemo(() => {
    if (!usersMap || Object.keys(usersMap).length === 0) return [];
    const ordersPerUser = {};

    orders.forEach((order) => {
      const key = order.username;
      ordersPerUser[key] = [...(ordersPerUser[key] || []), order];
    });

    return Object.values(usersMap).map((user) => {
      const userOrders = ordersPerUser[user.username];
      const ordersTableData = userOrders?.flatMap((order) => {
        return order.products.map((orderedProduct) => {
          return [
            orderedProduct.title,
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
  }, [usersMap, orders]);

  if (!tableData.length)
    return <div className="message-text">No customers yet</div>;

  return (
    <WebpageTable
      className="background-2"
      headers={["Full Name", "Joined At", "Products Bought"]}
      data={tableData}
    />
  );
};

export default CustomersTable;

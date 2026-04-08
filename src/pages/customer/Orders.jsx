import React from "react";
import { useSelector } from "react-redux";
import { WebpageTable, Price } from "@/components";

const Orders = () => {
  const orders = useSelector((state) => state.customer.orders);
  const products = useSelector((state) => state.data.products);

  if (orders.length === 0)
    return <div className="message-text">No orders yet</div>;

  const headers = ["Title", "Qty", "Price", "Date"];
  const data = orders.flatMap((order) =>
    order.products
      .map((product) => {
        if (!(product.title in products)) return null;

        const productData = products[product.title];
        const title = productData.title;
        const quantity = product.quantity;

        const unitPrice = productData.price;

        const totalPrice = unitPrice * quantity;

        const rawDate = order.date ?? order.createdAt;
        const parsedDate =
          rawDate?.toDate?.() ??
          (rawDate?.seconds
            ? new Date(rawDate.seconds * 1000)
            : new Date(rawDate));
        const orderDate =
          parsedDate && !isNaN(parsedDate)
            ? parsedDate.toLocaleDateString()
            : "-";

        return [title, quantity, <Price amount={totalPrice} />, orderDate];
      })
      .filter(Boolean),
  );

  return (
    <WebpageTable headers={headers} data={data} size="lg" striped={true} />
  );
};

export default Orders;

import { useSelector } from "react-redux";
import { WebpageTable } from "@/components";
import { useContext } from "react";
import { coinSign } from "@/ContextWrapper";

const Orders = () => {
  const [{ current: currentCoinSign, options }] = useContext(coinSign);
  const rate = options?.[currentCoinSign] ?? 1;
  const user = useSelector((state) => state.customer.user);
  const orders = user?.orders ?? [];
  const products = useSelector((state) => state.data.products);

  if (orders.length === 0)
    return <div className="message-text">No orders yet</div>;

  const headers = ["Title", "Qty", "Price", "Date"];

  const data = orders.flatMap((order) =>
    order.products
      .map((product) => {
        if (!(product.id in products)) return null;

        const productData = products[product.id];
        const title = productData.title;
        const quantity = product.quantity;

        const unitPrice = productData.price;

        const totalPrice = unitPrice * quantity * rate;

        const orderDate =
          order.date?.toDate?.()?.toLocaleDateString() ??
          (order.date?.seconds
            ? new Date(order.date.seconds * 1000).toLocaleDateString()
            : "-");

        return [
          title,
          quantity,
          `${currentCoinSign}${totalPrice.toFixed(2)}`,
          orderDate,
        ];
      })
      .filter(Boolean),
  );

  return (
    <WebpageTable headers={headers} data={data} size="lg" striped={true} />
  );
};

export default Orders;

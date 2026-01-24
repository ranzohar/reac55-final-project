import { useSelector } from "react-redux";
import { WebpageTable } from "@/components";
import { parsePrice } from "@/utils";

const Orders = () => {
  const user = useSelector((state) => state.customer.user);
  const orders = user?.orders ?? [];
  const products = useSelector((state) => state.data.products);

  if (orders.length === 0)
    return <div className="p-6 text-center text-gray-500">No orders yet</div>;

  const headers = ["Title", "Qty", "Price", "Date"];

  const data = orders.flatMap((order) =>
    order.products
      .map((product) => {
        if (!(product.id in products)) return null;

        const productData = products[product.id];
        const title = productData.title;
        const quantity = product.quantity;

        const rawPrice = productData.price;
        const { pricePrefix, price: unitPrice } = parsePrice(rawPrice);

        const totalPrice = unitPrice * quantity;

        const orderDate =
          order.date?.toDate?.()?.toLocaleDateString() ??
          (order.date?.seconds
            ? new Date(order.date.seconds * 1000).toLocaleDateString()
            : "-");

        return [title, quantity, `${pricePrefix}${totalPrice}`, orderDate];
      })
      .filter(Boolean),
  );

  return (
    <WebpageTable headers={headers} data={data} size="lg" striped={true} />
  );
};

export default Orders;

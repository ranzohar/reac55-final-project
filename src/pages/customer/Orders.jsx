import { useSelector } from "react-redux";
import { WebpageTable } from "../../components";

const Orders = () => {
  const user = useSelector((state) => state.customer.user);
  const orders = user?.orders ?? [];
  const products = useSelector((state) => state.data.products);

  if (orders.length === 0) return;

  const headers = ["Title", "Qty", "Price", "Date"];

  // Flatten orders so each product has its own row
  const data = orders.flatMap((order) =>
    order.products
      .map((product) => {
        if (!(product.id in products)) return null;

        const productData = products[product.id];
        const title = productData.title;
        const quantity = product.quantity;

        const rawPrice = productData.price;
        const pricePrefix = rawPrice[0].match(/\D/) ? rawPrice[0] : "";
        const unitPrice = +rawPrice.replace(/^\D/, "");

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

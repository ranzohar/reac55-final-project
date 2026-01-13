import { PieChart, Pie, Cell } from "recharts";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  if (cx == null || cy == null || innerRadius == null || outerRadius == null)
    return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const ncy = Number(cy);

  // Inside slice (value)
  const xInside = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const yInside = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  // Outside slice (name)
  const outerRadiusOffset = 20; // distance outside the slice
  const xOutside =
    ncx +
    (outerRadius + outerRadiusOffset) * Math.cos(-(midAngle ?? 0) * RADIAN);
  const yOutside =
    ncy +
    (outerRadius + outerRadiusOffset) * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <>
      {/* Inside: numeric value */}
      <text
        x={xInside}
        y={yInside}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {value}
      </text>

      {/* Outside: name */}
      <text
        x={xOutside}
        y={yOutside}
        fill="'black'"
        textAnchor={xOutside > ncx ? "start" : "end"}
        dominantBaseline="central"
      >
        {name}
      </text>
    </>
  );
};

const ProductsPieChart = () => {
  const orders = useSelector((state) => state.admin.orders);
  const products = useSelector((state) => state.data.products);
  const data = useMemo(() => {
    if (
      Object.entries(products).length === 0 ||
      Object.entries(orders).length === 0
    ) {
      return [];
    } // TODO check if needed
    const totals = {};

    orders.forEach((order) => {
      order.products.forEach((orderedProduct) => {
        console.log(products);
        const product = products[orderedProduct.id];
        const quantity = orderedProduct.quantity;
        totals[product.title] = {
          qty: (totals[product.title]?.qty ?? 0) + quantity,
          color: product.color,
        };
      });
    });

    return Object.entries(totals).map(([name, product]) => {
      return {
        name,
        value: product.qty,
        color: product.color,
      };
    });
  }, [orders, products]);

  return (
    <>
      <h3>Total Sold Products</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          labelLine={false}
          dataKey="value"
          nameKey="name"
          label={renderCustomizedLabel}
          isAnimationActive={false}
          stroke="none"
        >
          {data.map(({ color }, index) => (
            <Cell key={`cell-${index}`} fill={color} />
          ))}
        </Pie>
      </PieChart>
    </>
  );
};

export default ProductsPieChart;

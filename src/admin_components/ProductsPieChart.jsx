import { useSelector } from "react-redux";
import { useMemo } from "react";

import { PieChart, Pie, Cell } from "recharts";

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

  const radius = innerRadius + (outerRadius - innerRadius) * 0.93;
  const ncx = Number(cx);
  const ncy = Number(cy);

  const xInside = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const yInside = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  const outerRadiusOffset = 20;
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
    if (Object.entries(orders).length === 0) {
      return [];
    }
    const totals = {};

    orders.forEach((order) => {
      order.products.forEach((orderedProduct) => {
        if (orderedProduct.id in products) {
          const product = products[orderedProduct.id];
          const quantity = orderedProduct.quantity;
          totals[product.title] = {
            qty: (totals[product.title]?.qty ?? 0) + quantity,
            color: product.color,
          };
        }
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
    <div className="card">
      <h4 className="text-center">Total Sold Products</h4>
      {data.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No sales yet</div>
      ) : (
        <PieChart width={600} height={500}>
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
      )}
    </div>
  );
};

export default ProductsPieChart;

import { useMemo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { BarChart, Bar, Cell, LabelList } from "recharts";

import UserSelect from "./UserSelect";

const ProductsBarChart = () => {
  const orders = useSelector((state) => state.admin.orders);
  const products = useSelector((state) => state.data.products);
  const [userId, setUserId] = useState("");
  const dataPerUser = useMemo(() => {
    const dataPerUserObj = {};
    orders.forEach((order) => {
      if (Object.entries(orders).length === 0) {
        return [];
      }
      const userId = order.userId;
      if (!dataPerUserObj[userId]) {
        dataPerUserObj[userId] = {};
      }
      order.products.forEach((orderedProduct) => {
        if (orderedProduct.id in products) {
          const product = products[orderedProduct.id];
          const quantity = orderedProduct.quantity;
          dataPerUserObj[userId][product.title] = {
            qty: (dataPerUserObj[userId][product.title]?.qty ?? 0) + quantity,
            color: product.color,
          };
        }
      });
    });
    const dataPerUserLists = {};
    Object.entries(dataPerUserObj).forEach(([userId, totals]) => {
      dataPerUserLists[userId] = Object.entries(totals).map(([name, data]) => ({
        name,
        value: data.qty,
        color: data.color,
      }));
    });

    return dataPerUserLists;
  }, [orders, products]);
  const sortedData = useMemo(() => {
    return [...(dataPerUser[userId] || [])].sort((a, b) => a.value - b.value);
  }, [userId, dataPerUser]);

  const renderLabelInside = (props) => {
    const { x, y, width, height, index } = props;
    const entry = sortedData[index];
    const OFFSET = 10;

    return (
      <text
        x={x + width / 2}
        y={y + OFFSET}
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
      >
        <tspan x={x + width / 2} dy={0}>
          {entry?.value}
        </tspan>
        <tspan x={x + width / 2} dy="1.2em">
          {entry?.name}
        </tspan>
      </text>
    );
  };

  return (
    <>
      <h3 className="text-center">Products Quantity Per Customer</h3>
      <UserSelect userId={userId} setUserId={setUserId} />
      <BarChart
        width={500}
        height={300}
        data={sortedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        fill="transparent"
      >
        <Bar dataKey="value" isAnimationActive={false}>
          {sortedData.map((data, index) => (
            <Cell key={`cell-${index}`} fill={data.color} />
          ))}
          <LabelList content={renderLabelInside} />
        </Bar>
      </BarChart>
    </>
  );
};

export default ProductsBarChart;

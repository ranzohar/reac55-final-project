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

    const padding = 6;
    const availableHeight = Math.max(0, height - padding * 2);
    const lines = 2;
    // compute a base font size from available height (conservative scale)
    let fontSize = Math.floor(
      Math.max(8, Math.min(14, (availableHeight / lines) * 0.7)),
    );

    // adjust fontSize to also consider width and text length (approximate)
    const maxWidth = Math.max(20, width - padding * 2);
    const valueText = String(entry?.value ?? "");
    const nameText = entry?.name ?? "";
    const longest = Math.max(valueText.length, nameText.length, 1);
    const approxCharWidth = 0.6 * fontSize; // rough px per char
    if (longest * approxCharWidth > maxWidth) {
      fontSize = Math.max(8, Math.floor(maxWidth / longest / 0.6));
    }

    return (
      <text
        x={x + width / 2}
        y={y + OFFSET}
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
      >
        <tspan x={x + width / 2} dy={0}>
          {valueText}
        </tspan>
        <tspan x={x + width / 2} dy="1.2em">
          {nameText}
        </tspan>
      </text>
    );
  };

  return (
    <div className="card">
      <h4>Products Quantity Per Customer</h4>
      <UserSelect userId={userId} setUserId={setUserId} />
      {sortedData.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No data for selected user
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ProductsBarChart;

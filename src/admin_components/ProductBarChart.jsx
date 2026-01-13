import { BarChart, Bar, Cell, LabelList } from "recharts";
import { useMemo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import UserSelect from "./UserSelect";

const COLORS = [
  "#1F77B4",
  "#2CA02C",
  "#D62728",
  "#E377C2",
  "#FF7F0E",
  "#9467BD",
  "#17BECF",
  "#BCBD22",
  "#8C564B",
  "#AEC7E8",
  "#98DF8A",
  "#FF9896",
  "#C5B0D5",
  "#F7B6D2",
  "#C49C94",
  "#9EDAE5",
  "#DBDB8D",
  "#7F7F7F",
  "#393B79",
  "#637939",
];

const ProductsBarChart = () => {
  const orders = useSelector((state) => state.data.orders);
  const [userId, setUserId] = useState("");
  const dataPerUser = useMemo(() => {
    const dataPerUserObj = {};
    orders.forEach((order) => {
      const userId = order.userId;
      if (!dataPerUserObj[userId]) {
        dataPerUserObj[userId] = {};
      }
      order.products.forEach(({ product, quantity }) => {
        dataPerUserObj[userId][product.title] = {
          qty: (dataPerUserObj[userId][product.title]?.qty ?? 0) + quantity,
          color: product.color,
        };
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
  }, [orders]);
  const sortedData = useMemo(() => {
    return [...(dataPerUser[userId] || [])].sort(
      (a, b) => a.quantity - b.quantity
    );
  }, [userId, dataPerUser]);

  // Custom label renderer for inside-bar labels
  const renderLabelInside = (props) => {
    const { x, y, width, height, index } = props;
    const entry = sortedData[index];
    const OFFSET = 10;

    return (
      <text
        x={x + width / 2} // center horizontally
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

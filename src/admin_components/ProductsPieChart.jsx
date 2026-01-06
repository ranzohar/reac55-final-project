import { PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const COLORS = [
  '#1F77B4', '#2CA02C', '#D62728', '#E377C2',
  '#FF7F0E', '#9467BD', '#17BECF', '#BCBD22',
  '#8C564B', '#AEC7E8', '#98DF8A', '#FF9896',
  '#C5B0D5', '#F7B6D2', '#C49C94', '#9EDAE5',
  '#DBDB8D', '#7F7F7F', '#393B79', '#637939',
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
  const RADIAN = Math.PI / 180;
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const ncy = Number(cy);

  // Inside slice (value)
  const xInside = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const yInside = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  // Outside slice (name)
  const outerRadiusOffset = 20; // distance outside the slice
  const xOutside = ncx + (outerRadius + outerRadiusOffset) * Math.cos(-(midAngle ?? 0) * RADIAN);
  const yOutside = ncy + (outerRadius + outerRadiusOffset) * Math.sin(-(midAngle ?? 0) * RADIAN);

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
        textAnchor={xOutside > ncx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {name}
      </text>
    </>
  );
};

const ProductsPieChart = () => {
  const orders = useSelector((state) => state.data.orders);

  const data = useMemo(() => {
    const totals = {};

    orders.forEach((order) => {
      order.products.forEach(({ name, quantity }) => {
        totals[name] = (totals[name] ?? 0) + quantity;
      });
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [orders]);

  
  return ( <>
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
        {data.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
    </>
  );
}

export default ProductsPieChart;

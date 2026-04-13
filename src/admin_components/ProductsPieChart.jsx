import React, { useState, useEffect } from "react";
import { getProductStats } from "@/adapters/index";
import { useDarkMode } from "@/hooks";
import { titleToColor, getColorLightness } from "@/redux/dataReducer";
import { Spinner } from "@/components";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CHART_HEIGHT } from "./chartConfig";

const ProductsPieChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useDarkMode();
  const colorLightness = getColorLightness(isDark);

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
          style={{ fill: "var(--text-primary)" }}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {value}
        </text>

        {/* Outside: name */}
        <text
          x={xOutside}
          y={yOutside}
          style={{
            fill: titleToColor(name, colorLightness),
            filter: "brightness(2.5)",
          }}
          textAnchor={xOutside > ncx ? "start" : "end"}
          dominantBaseline="central"
        >
          {name}
        </text>
      </>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = getProductStats((result) => {
      setData([...result].sort((a, b) => b.value - a.value));
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="chart-wrapper">
      <h4 className="text-center">Total Sold Products</h4>
      {isLoading ? (
        <Spinner />
      ) : data.length === 0 ? (
        <div className="message-text">No sales yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <PieChart margin={{ top: 30, right: 80, bottom: 30, left: 80 }}>
            <Pie
              data={data}
              labelLine={false}
              dataKey="value"
              nameKey="name"
              label={renderCustomizedLabel}
              isAnimationActive={false}
              stroke="none"
            >
              {data.map(({ name }, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={titleToColor(name, colorLightness)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProductsPieChart;

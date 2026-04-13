import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDarkMode } from "@/hooks";
import { titleToColor, getColorLightness } from "@/redux/dataReducer";
import { getStatsByUser } from "@/adapters/index";
import { Spinner } from "@/components";

import { BarChart, Bar, Cell, LabelList, ResponsiveContainer } from "recharts";
import { CHART_HEIGHT } from "./chartConfig";

import UserSelect from "./UserSelect";

const ProductsBarChart = () => {
  const users = useSelector((state) => state.admin.users);
  const [userId, setUserId] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isDark = useDarkMode();
  const colorLightness = getColorLightness(isDark);

  const username = users[userId]?.username ?? "";

  useEffect(() => {
    if (!username) return;
    setIsLoading(true);
    const unsubscribe = getStatsByUser(username, (result) => {
      setData(result);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [username]);

  const renderLabelInside = (props) => {
    const { x, y, width, height, index } = props;
    const entry = data[index];
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
        style={{ fill: "var(--text-primary)" }}
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
  console.log(JSON.stringify(data, null, 2));
  return (
    <div className="chart-wrapper">
      <h4>Products Quantity Per Customer</h4>
      <UserSelect userId={userId} setUserId={setUserId} />
      {isLoading ? (
        <Spinner />
      ) : data.length === 0 ? (
        <div className="message-text">No data for selected user</div>
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            fill="transparent"
          >
            <Bar dataKey="value" isAnimationActive={false}>
              {data.map((data, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={titleToColor(data.name, colorLightness)}
                />
              ))}
              <LabelList content={renderLabelInside} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProductsBarChart;

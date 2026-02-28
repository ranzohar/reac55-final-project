import React, { ReactNode, FC } from "react";

type Size = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1",
  md: "text-base [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2",
  lg: "text-lg [&_th]:px-8 [&_th]:py-6 [&_td]:px-8 [&_td]:py-6",
};

interface WebpageTableProps {
  headers: ReactNode[];
  data: ReactNode[][];
  size?: Size;
  striped?: boolean;
  className?: string;
}

const WebpageTable: FC<WebpageTableProps> = ({
  headers,
  data,
  size = "md",
  striped = false,
  className = "",
}) => {
  const sizeClasses: string = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <table
      className={`${sizeClasses} ${striped ? "table-striped" : ""} ${className}`.trim()}
    >
      <thead>
        <tr>
          {headers.map((header: ReactNode, index: number) => {
            return <th key={index}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row: ReactNode[], rowIndex: number) => {
          return (
            <tr key={rowIndex}>
              {row.map((component: ReactNode, colIndex: number) => {
                return <td key={colIndex}>{component}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default WebpageTable;

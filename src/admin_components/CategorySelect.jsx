import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function CategorySelect({ categoryId, setCategoryId }) {
  const categories = useSelector((state) => state.data.categories);

  const entries = Object.entries(categories);

  useEffect(() => {
    if (categoryId && !(categoryId in categories)) {
      setCategoryId("");
    }
  }, [categories, setCategoryId]);

  return (
    <select
      defaultValue={categoryId || ""}
      onChange={(e) => setCategoryId(e.target.value)}
      className="
        bg-white text-black
        dark:bg-gray-800 dark:text-white
        border border-gray-300 dark:border-gray-600
        rounded px-2 py-1
      "
    >
      <option value="">No category</option>
      {entries.map(([key, category]) => (
        <option key={key} value={key}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

export default CategorySelect;

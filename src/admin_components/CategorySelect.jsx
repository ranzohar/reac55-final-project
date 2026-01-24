import { useSelector } from "react-redux";
import { useEffect } from "react";

function CategorySelect({ categoryId, setCategoryId }) {
  const categories = useSelector((state) => state.admin.categories);

  const entries = Object.entries(categories);
  const defaultKey = entries[0]?.[0];

  useEffect(() => {
    if (!categoryId || !(categoryId in categories)) {
      setCategoryId(defaultKey || "");
    }
  }, [categories, setCategoryId]);

  return (
    <select
      defaultValue={defaultKey || ""}
      onChange={(e) => setCategoryId(e.target.value)}
      className="
        bg-white text-black
        dark:bg-gray-800 dark:text-white
        border border-gray-300 dark:border-gray-600
        rounded px-2 py-1
      "
    >
      {entries.length === 0 ? (
        <option value="" disabled>
          no categories available
        </option>
      ) : (
        entries.map(([key, category]) => (
          <option key={key} value={key}>
            {category.name}
          </option>
        ))
      )}
    </select>
  );
}

export default CategorySelect;

import { useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const FilterTab = ({
  priceLimit,
  setPriceLimit,
  categoryFilter,
  setCategoryFilter,
  titleFilter,
  setTitleFilter,
}) => {
  const products = useSelector((state) => state.data.products);
  const categories = useSelector((state) => state.data.categories);
  const initialized = useRef(false);

  const maxPrice = useMemo(() => {
    const entries = Object.entries(products || {});
    if (entries.length === 0) return 0;
    return Math.max(
      ...entries.map(
        ([_, product]) => Number(product.price?.replace(/^\D/, "")) || 0
      )
    );
  }, [products]);

  useEffect(() => {
    if (!initialized.current && maxPrice > 0) {
      setPriceLimit(maxPrice);
      initialized.current = true;
    }
  }, [maxPrice, setPriceLimit]);

  const clearFilters = () => {
    setPriceLimit(maxPrice);
    setCategoryFilter("");
    setTitleFilter("");
  };

  return (
    <div className="flex items-center space-x-2 p-2 mb-4 border rounded shadow flex-wrap">
      {/* Category Select */}
      <div className="flex flex-col">
        <label className="text-xs">Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="
    px-2 py-1 border rounded text-sm
    bg-white text-black
    dark:bg-gray-700 dark:text-white
    appearance-none
  "
        >
          <option value="">All</option>
          {Object.entries(categories).map(([id, cat]) => (
            <option key={id} value={id}>
              {cat.name || id}
            </option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div className="flex flex-col flex-1 min-w-[150px]">
        <label className="text-xs">Max Price: {priceLimit.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max={maxPrice}
          step="0.01"
          value={priceLimit}
          onChange={(e) => setPriceLimit(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Title Filter */}
      <div className="flex flex-col flex-1 min-w-[150px]">
        <label className="text-xs">Search Title</label>
        <input
          type="text"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          placeholder="Type to search..."
          className="px-2 py-1 border rounded text-sm"
        />
      </div>

      {/* Clear Button */}
      <button
        type="button"
        onClick={clearFilters}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-400 dark:text-white rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Clear
      </button>
    </div>
  );
};

export default FilterTab;

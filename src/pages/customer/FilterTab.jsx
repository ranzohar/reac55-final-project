import { useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { coinSign } from "@/ContextWrapper";

const FilterTab = ({
  priceLimit,
  setPriceLimit,
  categoryFilter,
  setCategoryFilter,
  titleFilter,
  setTitleFilter,
}) => {
  const [{ current: currentCoinSign, options }] = useContext(coinSign);
  const rate = options?.[currentCoinSign] ?? 1;
  const products = useSelector((state) => state.data.products);
  const categories = useSelector((state) => state.data.categories);
  const initialized = useRef(false);

  const maxPrice = useMemo(() => {
    const entries = Object.entries(products || {});
    if (entries.length === 0) return 0;
    return Math.max(...entries.map(([_, product]) => +product.price || 0));
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
    <div className="filter-tab">
      {/* Category Select */}
      <label className="text-xs">Category</label>
      <select
        id="categoryFilter"
        name="categoryFilter"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All</option>
        {Object.entries(categories).map(([id, cat]) => (
          <option key={id} value={id}>
            {cat.name || id}
          </option>
        ))}
      </select>

      {/* Price Filter */}
      <label>
        Max Price: {currentCoinSign}
        {(priceLimit * rate).toFixed(2)}
      </label>
      <input
        id="priceLimit"
        name="priceLimit"
        type="range"
        min="0"
        max={maxPrice}
        step="0.01"
        value={priceLimit}
        onChange={(e) => setPriceLimit(Number(e.target.value))}
      />

      {/* Title Filter */}
      <div className="inline">
        <label>Title:</label>
        <input
          id="titleFilter"
          name="titleFilter"
          type="text"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          placeholder="Type to search..."
          className="input-base"
        />
      </div>

      {/* Clear Button */}
      <button
        type="button"
        onClick={clearFilters}
        className="btn-small btn-grey"
      >
        Clear
      </button>
    </div>
  );
};

export default FilterTab;

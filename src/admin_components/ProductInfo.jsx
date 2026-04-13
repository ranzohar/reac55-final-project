import React from "react";
import { useState, useEffect, useRef } from "react";

import { useCategories, useCurrencies } from "@/hooks";
import { LINK_TO_PIC } from "@/key-constants";

import { WebpageTable } from "@/components";

const ERROR_CODE_MESSAGES = {
  PRODUCT_TITLE_TAKEN: "Title already exists",
  CATEGORY_NOT_FOUND: "Category not found",
  PRODUCT_NOT_FOUND: "Product not found",
};

function parseSaveError(err) {
  const code = err?.response?.data?.code;
  if (code && ERROR_CODE_MESSAGES[code]) return ERROR_CODE_MESSAGES[code];
  return (
    err?.response?.data?.message || err?.message || "Failed to save product"
  );
}

const ProductInfo = ({
  product,
  onSave,
  onDelete,
  onChange,
  className,
  initialFeedback = null,
}) => {
  const { categories } = useCategories();
  const { rate, currentCoinSign } = useCurrencies();

  const convertedPrice =
    product.price || product.price === 0
      ? (Number(product.price) * rate).toFixed(2)
      : "";

  const [feedback, setFeedback] = useState(initialFeedback); // { type: 'success'|'error', message }

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const [formState, setFormState] = useState({
    title: product.title || "",
    categoryId: product.categoryId || "",
    description: product.description || "",
    price: convertedPrice,
    [LINK_TO_PIC]: product[LINK_TO_PIC] || "",
  });

  const prevRateRef = useRef(rate);
  useEffect(() => {
    const prevRate = prevRateRef.current;
    if (prevRate !== rate) {
      setFormState((prev) => ({
        ...prev,
        price:
          prev.price !== ""
            ? ((Number(prev.price) / prevRate) * rate).toFixed(2)
            : "",
      }));
      prevRateRef.current = rate;
    }
  }, [rate]);

  const activeCategoryId = categories?.some(
    (c) => c.id === formState.categoryId,
  )
    ? formState.categoryId
    : "";

  useEffect(() => {
    onChange?.(formState);
  }, [formState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const sanitizePriceInput = (value) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    if (cleaned === "") return "";
    if (cleaned === ".") return "0.";
    const parts = cleaned.split(".");
    const whole = parts[0] || "0";
    const decimals = parts.slice(1).join("").slice(0, 2);
    return parts.length > 1 ? `${whole}.${decimals}` : whole;
  };

  const save = async () => {
    const normalizedPrice = (Number(formState.price) / rate).toFixed(2);
    const selectedCategory = categories.find(
      (c) => c.id === formState.categoryId,
    );
    try {
      // console.log("Saving product with data:", {
      //   title: formState.title,
      //   price: normalizedPrice,
      //   [LINK_TO_PIC]: formState[LINK_TO_PIC],
      //   description: formState.description,
      //   categoryId: formState.categoryId,
      //   categoryName: selectedCategory?.name || "",
      // });
      await onSave({
        title: formState.title,
        price: normalizedPrice,
        [LINK_TO_PIC]: formState[LINK_TO_PIC],
        description: formState.description,
        categoryId: formState.categoryId,
        // categoryName: selectedCategory?.name || "",
      });
      setFeedback({ type: "success", message: "Saved!" });
    } catch (err) {
      setFeedback({ type: "error", message: parseSaveError(err) });
    }
  };

  if (!product) return null;

  const formatDate = (val) => {
    if (!val) return val;
    const d = new Date(val);
    if (isNaN(d)) return val;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const boughtByRows = (product.boughtBy || []).map((row) => {
    let cells;
    if (Array.isArray(row)) cells = row.slice(0, 3);
    else if (row && typeof row === "object")
      cells = Object.values(row).slice(0, 3);
    else return row;
    return cells.map((cell, i) => (i === 2 ? formatDate(cell) : cell));
  });

  return (
    <div className={`card-product${className ? ` ${className}` : ""}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="grid-t">
          <span>Title:</span>
          <input
            className="input-base"
            name="title"
            placeholder="Product title"
            value={formState.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>

        <label className="grid-p">
          <span>Price:</span>
          <div className="inline">
            <span>{currentCoinSign}</span>
            <input
              className="input-base"
              name="price"
              type="text"
              inputMode="decimal"
              value={formState.price}
              onChange={(e) =>
                handleChange("price", sanitizePriceInput(e.target.value))
              }
              required
            />
          </div>
        </label>

        <label className="grid-c">
          <span>Category:</span>
          <select
            className="input-base"
            name="categoryId"
            value={activeCategoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
          >
            <>
              <option value="">No category</option>
              {(categories || []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </>
          </select>
        </label>

        <label className="grid-l">
          Link to pic:
          <input
            className="input-base"
            name={LINK_TO_PIC}
            value={formState[LINK_TO_PIC]}
            onChange={(e) => handleChange(LINK_TO_PIC, e.target.value)}
          />
        </label>

        <label className="grid-d">
          Description:
          <textarea
            className="input-base"
            name="description"
            value={formState.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </label>

        <div
          className="grid-s"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            alignItems: "flex-start",
          }}
        >
          <button type="submit" className="btn-green btn-small">
            Save
          </button>
          {feedback && (
            <span
              style={{
                fontSize: "var(--text-s)",
                color: feedback.type === "error" ? "#ef4444" : "#22c55e",
              }}
            >
              {feedback.message}
            </span>
          )}
        </div>
      </form>

      <div className="grid-b">
        Bought By:
        {product.boughtBy && product.boughtBy.length > 0 ? (
          <WebpageTable headers={["Name", "Qty", "date"]} data={boughtByRows} />
        ) : (
          <div className="message-text">No sales yet</div>
        )}
      </div>

      <div className="grid-x">
        <button type="button" className="btn-red btn-small" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;

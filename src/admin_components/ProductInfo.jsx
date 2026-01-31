import { useState, useEffect } from "react";

import { useCategories } from "../hooks";
import { WebpageTable } from "../components";
import { LINK_TO_PIC } from "@/firebase-key-constants";

const ProductInfo = ({ product, onUpdate }) => {
  const { categories } = useCategories();

  const [changeProduct, setChangeProduct] = useState({
    title: "",
    categoryId: "",
    description: "",
    price: "",
    [LINK_TO_PIC]: "",
  });

  useEffect(() => {
    if (product && categories) {
      setChangeProduct({
        title: product.title || "",
        categoryId: product.categoryId || "",
        description: product.description || "",
        price: product.price || "",
        [LINK_TO_PIC]: product[LINK_TO_PIC] || "",
      });
    }
  }, [product, categories]);

  const handleChange = (key, value) => {
    setChangeProduct((prev) => ({ ...prev, [key]: value }));
  };

  const update = () => {
    if (!changeProduct.title || !changeProduct.price) {
      return;
    }
    onUpdate({
      title: changeProduct.title,
      price: changeProduct.price,
      [LINK_TO_PIC]: changeProduct[LINK_TO_PIC],
      description: changeProduct.description,
      categoryId: changeProduct.categoryId,
    });
  };

  if (!product) return null;

  const boughtByRows = (product.boughtBy || []).map((row) => {
    if (Array.isArray(row)) return row.slice(0, 3);
    if (row && typeof row === "object") return Object.values(row).slice(0, 3);
    return row;
  });

  return (
    <div className="card-product">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update();
        }}
      >
        <label className="grid-t">
          <span>Title:</span>
          <input
            className="input-base"
            name="title"
            value={changeProduct.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>

        <label className="grid-p">
          Price:
          <input
            className="input-base"
            name="price"
            value={changeProduct.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />
        </label>

        <label className="grid-c">
          <span>Category:</span>
          <select
            className="input-base"
            name="categoryId"
            value={changeProduct.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
          >
            {!categories || categories.length === 0 ? (
              <option value="" disabled>
                no categories available
              </option>
            ) : (
              <>
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </label>

        <label className="grid-l">
          Link to pic:
          <input
            className="input-base"
            name={LINK_TO_PIC}
            value={changeProduct[LINK_TO_PIC]}
            onChange={(e) => handleChange(LINK_TO_PIC, e.target.value)}
          />
        </label>

        <label className="grid-d">
          Description:
          <textarea
            className="input-base"
            name="description"
            value={changeProduct.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </label>

        <div className="grid-s">
          <button type="submit" className="btn-green btn-small">
            Save
          </button>
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
    </div>
  );
};

export default ProductInfo;

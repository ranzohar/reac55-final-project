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

  return (
    <div className="grid grid-cols-2 gap-4 max-w-xl border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-900 shadow-sm">
      <form
        className="col-span-2 grid grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          update();
        }}
      >
        <label className="flex items-center gap-2">
          <span>Title:</span>
          <input
            className="input-base"
            name="title"
            value={changeProduct.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col">
          Price:
          <input
            className="input-base"
            name="price"
            value={changeProduct.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col">
          Category:
          <select
            className="input-base"
            name="categoryId"
            value={changeProduct.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          Link to pic:
          <input
            className="input-base"
            name={LINK_TO_PIC}
            value={changeProduct[LINK_TO_PIC]}
            onChange={(e) => handleChange(LINK_TO_PIC, e.target.value)}
          />
        </label>

        <label className="flex flex-col col-span-2">
          Description:
          <textarea
            className="input-base h-full"
            name="description"
            value={changeProduct.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </label>

        <div className="flex gap-2 mt-2 col-span-2">
          <button type="submit" className="bg-green-400 dark:bg-green-600 w-20">
            Save
          </button>
        </div>
      </form>

      <div className="flex flex-col col-span-2">
        Bought By:
        <WebpageTable
          headers={["Name", "Qty", "date"]}
          data={product.boughtBy || []}
        />
      </div>
    </div>
  );
};

export default ProductInfo;

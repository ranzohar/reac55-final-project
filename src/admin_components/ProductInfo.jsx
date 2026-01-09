import { useState, useEffect } from "react";
import useCategories from "../firebase/hooks/useCategories";
import WebpageTable from "../components/WebpageTable";
import { useParams } from "react-router-dom";

const ProductInfo = ({ product, onUpdate }) => {
  const { adminId } = useParams();
  const { categories } = useCategories(adminId);

  const [changeProduct, setChangeProduct] = useState({
    title: "",
    categoryId: "",
    description: "",
    price: -1,
    link: "",
  });

  useEffect(() => {
    if (product && categories) {
      const matchedCategory = categories.find(
        (cat) => cat.name === product.category
      );
      setChangeProduct({
        title: product.title || "",
        categoryId: matchedCategory ? matchedCategory.id : "",
        description: product.description || "",
        price: product.price ?? -1,
        link: product.link || "",
      });
    }
  }, [product, categories]);

  const handleChange = (key, value) => {
    setChangeProduct((prev) => ({ ...prev, [key]: value }));
  };

  if (!product) return null;

  return (
    <div className="grid grid-cols-2 gap-4 max-w-xl border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-900 shadow-sm">
      <label className="flex items-center gap-2">
        <span>Title:</span>
        <input
          className="input-base"
          value={changeProduct.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </label>

      <label className="flex flex-col">
        Price:
        <input
          className="input-base"
          type="number"
          value={changeProduct.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
      </label>

      <label className="flex flex-col">
        Category:
        <select
          className="input-base"
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
          value={changeProduct.link}
          onChange={(e) => handleChange("link", e.target.value)}
        />
      </label>

      <label className="flex flex-col">
        Description:
        <textarea
          className="input-base h-full"
          value={changeProduct.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </label>

      <div className="flex flex-col">
        Bought By:
        <WebpageTable
          headers={["h1", "h2", "h3"]}
          data={[
            ["1", "2", "3"],
            [
              "4",
              "5",
              <WebpageTable
                headers={["h1", "h2", "h3"]}
                data={[
                  ["1", "2", "3"],
                  ["4", "5", "6"],
                ]}
              />,
            ],
          ]}
        />
      </div>

      <div className="flex gap-2 mt-2">
        <button
          className="bg-green-400 dark:bg-green-600 w-20"
          onClick={() =>
            onUpdate({
              title: changeProduct.title,
              price: Number(changeProduct.price),
              link_to_pic: changeProduct.link,
              description: changeProduct.description,
              categoryId: changeProduct.categoryId || undefined,
            })
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;

import { Category } from "../../admin_components";
import { useCategories } from "../../hooks";
import { useState } from "react";

const Categories = () => {
  const {
    categories,
    addNewCategory,
    updateExistingCategory,
    removeExistingCategory,
  } = useCategories();
  const [newCategory, setNewCategory] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold">Categories:</h2>
      {categories.map((category) => (
        <Category
          key={category.id}
          id={category.id}
          name={category.name}
          updateExistingCategory={updateExistingCategory}
          removeExistingCategory={removeExistingCategory}
        />
      ))}

      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="
          px-3 py-1
          border border-gray-300
          rounded
          bg-white text-black
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:bg-gray-500 dark:text-white dark:border-gray-600
          min-w-60
        "
        placeholder="Add new category"
      />
      <button
        className="bg-green-400 dark:bg-green-600 w-20 text-black"
        onClick={() => {
          addNewCategory(newCategory);
          setNewCategory("");
        }}
      >
        Add
      </button>
    </div>
  );
};

export default Categories;

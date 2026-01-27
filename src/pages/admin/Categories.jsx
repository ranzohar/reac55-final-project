import { Category } from "@/admin_components";
import { useCategories } from "@/hooks";
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
      {categories.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No categories yet</div>
      ) : (
        categories.map((category) => (
          <Category
            key={category.id}
            id={category.id}
            name={category.name}
            updateExistingCategory={updateExistingCategory}
            removeExistingCategory={removeExistingCategory}
          />
        ))
      )}

      <div className="flex gap-2">
        <input
          id="newCategory"
          name="newCategory"
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="input-base"
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
    </div>
  );
};

export default Categories;

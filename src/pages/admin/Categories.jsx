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
    <div className="card-subpage">
      <h3 className="text-2xl font-bold">Categories:</h3>
      <div className="card-categories">
        {categories.length === 0 ? (
          <div className="card-category">No categories yet</div>
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

        <div className="inline">
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
            className="btn-small btn-green"
            onClick={() => {
              addNewCategory(newCategory);
              setNewCategory("");
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;

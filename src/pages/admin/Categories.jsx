import Category from "../../admin_components/Category";
import useCategories from "../../firebase/hooks/useCategories";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Categories = () => {
  const { adminId } = useParams();
  const {
    categories,
    addNewCategory,
    updateExistingCategory,
    removeExistingCategory,
  } = useCategories(adminId);
  const [newCategory, setNewCategory] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold">Categories:</h2>
      {categories.map((category) => (
        <Category
          key={category.id} // use id as key instead of index
          id={category.id} // pass id to child
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
        className="bg-green-500 w-20 text-black"
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

import { addCategory } from "../../firebase/doc-utils";
import Category from "../../admin_components/Category";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCategoriesData } from "../../firebase/doc-utils";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    // TODO - all components get the userAuth and load data if it changes. If it's not logged in clear firebase.
    console.log("Getting categories");
    getCategoriesData(setCategories);
  }, []);

  useEffect(() => {
    dispatch({
      type: "LOAD",
      payload: { categories },
    });
  }, [categories]);

  const onAddCategory = (newCategory) => {
    if (
      newCategory.toLowerCase() === "undefined" ||
      categories.find(
        (category) => category.name.toLowerCase() === newCategory.toLowerCase()
      )
    ) {
      return;
    }
    addCategory(newCategory);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Categories:</h2>
      {categories.map((category) => {
        return <Category key={category.id} categoryId={category.id} />;
      })}
      <input
        type="text"
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
        className="bg-green-500 w-20"
        onClick={() => onAddCategory(newCategory)}
      >
        Add
      </button>
    </div>
  );
};

export default Categories;

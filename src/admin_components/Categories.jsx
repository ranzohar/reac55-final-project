import { addCategory } from "../firebase/firebase-utils";
import Category from "./Category";
import { useSelector } from "react-redux";
import { useState } from "react";

const Categories = () => {
  const categories = useSelector((state) => state.data.categories);
  const [newCategory, setNewCategory] = useState("");
  return (
    <>
      <h2 className="text-2xl font-bold">Categories:</h2>
      {Object.keys(categories).map((categorieId) => {
        return <Category key={categorieId} categoryId={categorieId} />;
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
        "
        placeholder="Add new category"
      />
      <button className="bg-green-500" onClick={() => addCategory(newCategory)}>
        Add
      </button>
    </>
  );
};

export default Categories;

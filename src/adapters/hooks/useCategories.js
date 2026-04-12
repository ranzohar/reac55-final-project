import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { addCategory, updateCategory, removeCategory } from "@/adapters";
import { mapObjectToArray } from "@/utils";
import { BACKEND_TYPE } from "@/config/backend";

const useCategoriesHook = () => {
  const categoriesMap = useSelector((state) => state.data.categories);
  const dispatch = useDispatch();

  const addNewCategory = async (newCategoryName) => {
    if (!newCategoryName) return;

    const exists = Object.values(categoriesMap).some(
      (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase(),
    );
    if (exists) return;
    const category = await addCategory(newCategoryName);
    if (BACKEND_TYPE === "rest" && category) {
      dispatch({ type: "ADD_CATEGORY", payload: { category } });
    }
  };

  const updateExistingCategory = async (name, newName) => {
    if (!name || !newName || !categoriesMap[name]) return;
    const exists = Object.values(categoriesMap).some(
      (cat) => cat.name.toLowerCase() === newName.toLowerCase(),
    );
    if (exists) return false;
    const category = await updateCategory(name, newName);
    if (BACKEND_TYPE === "rest" && category) {
      dispatch({ type: "UPDATE_CATEGORY", payload: { oldName: name, category } });
    }
    return true;
  };

  const removeExistingCategory = async (name) => {
    if (!name || !categoriesMap[name]) return;
    const deletedName = await removeCategory(name);
    if (BACKEND_TYPE === "rest" && deletedName) {
      dispatch({ type: "REMOVE_CATEGORY", payload: { name: deletedName } });
    }
  };

  const categories = useMemo(
    () => mapObjectToArray(categoriesMap),
    [categoriesMap],
  );

  return {
    categories,
    addNewCategory,
    updateExistingCategory,
    removeExistingCategory,
  };
};

export { useCategoriesHook as useCategories };

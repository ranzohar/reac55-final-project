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

  const updateExistingCategory = async (id, name) => {
    if (!id || !name || !categoriesMap[id]) return;
    const exists = Object.values(categoriesMap).some(
      (cat) => cat.name.toLowerCase() === name.toLowerCase(),
    );
    if (exists) return false;
    const category = await updateCategory(id, name);
    if (BACKEND_TYPE === "rest" && category) {
      dispatch({ type: "UPDATE_CATEGORY", payload: { category } });
    }
    return true;
  };

  const removeExistingCategory = async (id) => {
    if (!id || !categoriesMap[id]) return;
    const categoryId = await removeCategory(id);
    if (BACKEND_TYPE === "rest" && categoryId) {
      dispatch({ type: "REMOVE_CATEGORY", payload: { id: categoryId } });
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

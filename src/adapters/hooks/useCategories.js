import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { addCategory, updateCategory, removeCategory } from "@/adapters";
import { mapObjectToArray } from "@/utils";

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
    if (category) {
      dispatch({ type: "ADD_CATEGORY", payload: { category } });
    }
  };

  const updateExistingCategory = async (id, newName) => {
    if (!id || !newName || !categoriesMap[id]) return;
    const exists = Object.values(categoriesMap).some(
      (cat) =>
        cat.id !== id && cat.name.toLowerCase() === newName.toLowerCase(),
    );
    if (exists) return false;
    const category = await updateCategory(id, newName);
    if (category) {
      dispatch({ type: "UPDATE_CATEGORY", payload: { category } });
    }
    return true;
  };

  const removeExistingCategory = async (id) => {
    if (!id || !categoriesMap[id]) return;
    const deletedId = await removeCategory(id);
    if (deletedId) {
      dispatch({ type: "REMOVE_CATEGORY", payload: { id: deletedId } });
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

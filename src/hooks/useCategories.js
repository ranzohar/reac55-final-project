import { useMemo } from "react";
import { useSelector } from "react-redux";

import { addCategory, updateCategory, removeCategory } from "@/firebase";
import { mapObjectToArray } from "@/utils";

const useCategories = () => {
  const categoriesMap = useSelector((state) => state.data.categories);

  const addNewCategory = (newCategoryName) => {
    if (!newCategoryName) return;

    const exists = Object.values(categoriesMap).some(
      (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase(),
    );
    if (exists) return;
    addCategory(newCategoryName);
  };

  const updateExistingCategory = (id, updatedData) => {
    if (!id || !updatedData || !categoriesMap[id]) return;
    updateCategory(id, updatedData);
  };

  const removeExistingCategory = (id) => {
    if (!id || !categoriesMap[id]) return;
    removeCategory(id);
  };

  const categories = useMemo(
    () =>
      mapObjectToArray(categoriesMap).sort((a, b) => {
        const dateA = a.createDate?.toMillis ? a.createDate.toMillis() : 0;
        const dateB = b.createDate?.toMillis ? b.createDate.toMillis() : 0;
        return dateA - dateB;
      }),
    [categoriesMap],
  );

  return {
    categories,
    addNewCategory,
    updateExistingCategory,
    removeExistingCategory,
  };
};

export default useCategories;

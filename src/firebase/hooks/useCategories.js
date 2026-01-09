import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoriesData,
  addCategory,
  updateCategory,
  removeCategory,
} from "../doc-utils";

const useCategories = (userId) => {
  const dispatch = useDispatch();
  const categoriesMap = useSelector((state) => state.data.categories);

  // Subscribe to Firebase categories
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = getCategoriesData((data) => {
      dispatch({
        type: "LOAD",
        payload: { categories: data },
      });
    });

    return () => unsubscribe();
  }, [userId]);

  /** Add a new category if it doesn't exist */
  const addNewCategory = (newCategoryName) => {
    if (!newCategoryName) return;

    const exists = Object.values(categoriesMap).some(
      (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase()
    );
    if (exists) return;
    console.log(newCategoryName);

    addCategory(newCategoryName);
  };

  /** Update an existing category by ID */
  const updateExistingCategory = (id, updatedData) => {
    if (!id || !updatedData || !categoriesMap[id]) return;
    updateCategory(id, updatedData);
  };

  /** Remove a category by ID */
  const removeExistingCategory = (id) => {
    console.log("removing", id);

    if (!id || !categoriesMap[id]) return;
    removeCategory(id);
  };

  const categories = useMemo(
    () =>
      Object.entries(categoriesMap).map(([id, category]) => ({
        id,
        ...category,
      })),
    [categoriesMap]
  );

  return {
    categories,
    addNewCategory,
    updateExistingCategory,
    removeExistingCategory,
  };
};

export default useCategories;

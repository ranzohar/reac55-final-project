import useCategories from "@/firebase/hooks/useCategories";
// TODO implement REST useCategories

const useCategoriesHook = () => {
  return useCategories();
};

export { useCategoriesHook as useCategories };

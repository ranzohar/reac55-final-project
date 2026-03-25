import useProducts from "@/firebase/hooks/useProducts";
// TODO implement REST useProducts

const useProductsHook = () => {
  return useProducts();
};

export { useProductsHook as useProducts };

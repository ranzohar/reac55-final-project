import { useMemo } from "react";
import { useSelector } from "react-redux";
import { mapObjectToArray } from "@/utils";

const useProductsHook = () => {
  const productsMap = useSelector((state) => state.data.products);
  const products = useMemo(() => mapObjectToArray(productsMap), [productsMap]);
  return { products };
};

export { useProductsHook as useProducts };

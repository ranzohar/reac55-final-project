import { useMemo } from "react";
import { useSelector } from "react-redux";

import { upsertProduct } from "@/adapters";
import { mapObjectToArray } from "@/utils";

const useProductsHook = () => {
  const productsMap = useSelector((state) => state.data.products);

  const addOrUpdateProduct = (id, newProduct) => {
    upsertProduct(id, newProduct);
  };

  const products = useMemo(() => mapObjectToArray(productsMap), [productsMap]);

  return {
    products,
    addOrUpdateProduct,
  };
};

export { useProductsHook as useProducts };

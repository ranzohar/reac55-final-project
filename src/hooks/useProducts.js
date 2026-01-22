import { useMemo } from "react";
import { useSelector } from "react-redux";

import { upsertProduct } from "@/firebase";
import { mapObjectToArray } from "@/utils";

const useProducts = () => {
  const productsMap = useSelector((state) => state.data.products);

  const addOrUpdateProduct = (id, newProduct, index) => {
    upsertProduct(id, newProduct, index);
  };

  const products = useMemo(() => mapObjectToArray(productsMap), [productsMap]);

  return {
    products,
    addOrUpdateProduct,
  };
};

export default useProducts;

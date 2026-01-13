import { useMemo } from "react";
import { useSelector } from "react-redux";
import { upsertProduct } from "../../firebase/doc-utils";

const useProducts = () => {
  const productsMap = useSelector((state) => state.data.products);

  const addOrUpdateProduct = (id, newProduct, index) => {
    upsertProduct(id, newProduct, index);
  };

  const products = useMemo(
    () =>
      Object.entries(productsMap).map(([id, product]) => ({
        id,
        ...product,
      })),
    [productsMap]
  );

  return {
    products,
    addOrUpdateProduct,
  };
};

export default useProducts;

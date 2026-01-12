import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsData, upsertProduct } from "../../firebase/doc-utils";

const useProducts = (userId, admin) => {
  const dispatch = useDispatch();
  const firebaseProductsMap = useSelector((state) => state.data.products);
  const adminProductsMap = useSelector((state) => state.admin.products);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = getProductsData((data) => {
      if (admin) {
        // TODO - move loads to main\
        dispatch({
          type: "LOAD_ADMIN_PRODUCTS",
          payload: data,
        });
      } else {
        dispatch({
          type: "LOAD",
          payload: { products: data },
        });
      }
    });

    return () => unsubscribe();
  }, [userId]);

  /** Add a new product if it doesn't exist */
  const addOrUpdateProduct = (id, newProduct) => {
    upsertProduct(id, newProduct);
  };
  const productsMap = admin ? adminProductsMap : firebaseProductsMap;
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

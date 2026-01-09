import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsData, updateProduct } from "../../firebase/doc-utils";

const useProducts = (userId) => {
  const dispatch = useDispatch();
  const productsMap = useSelector((state) => state.data.products);

  // Subscribe to Firebase products
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = getProductsData((data) => {
      dispatch({
        type: "LOAD",
        payload: { products: data },
      });
    });

    return () => unsubscribe();
  }, [userId, dispatch]);

  /** Add a new product if it doesn't exist */
  const addNewProduct = (newProduct) => {
    if (!newProduct?.title) return;

    const exists = Object.values(productsMap).some(
      (prod) => prod.title.toLowerCase() === newProduct.title.toLowerCase()
    );
    if (exists) return;

    // Call your addProduct function if you have one
    // addProduct(newProduct);
    console.warn("addProduct not implemented here, implement if needed");
  };

  /** Update an existing product by ID */
  const updateExistingProduct = async (id, updatedData) => {
    if (!id || !updatedData || !productsMap[id]) return;

    try {
      await updateProduct({ productId: id, ...updatedData });
    } catch (err) {
      console.error("Failed to update product:", err);
    }
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
    addNewProduct,
    updateExistingProduct,
  };
};

export default useProducts;

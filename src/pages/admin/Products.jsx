import ProductInfo from "../../admin_components/ProductInfo";
import useProducts from "../../firebase/hooks/useProducts"; // import your updated hook
import { useSelector, useDispatch } from "react-redux";
import { getFirebaseUniqueId } from "../../firebase/doc-utils";
import { useEffect, useMemo } from "react";

// Products uses the local redux firebase
// Any updates done by other admins or directly on firebase will not be seen
// untill refreshing the site. This is acceptable as products shuold only
// be added/edits by a single admin
// For deleting products, access firebase->delete product->refresh the page

const Products = () => {
  const { products, addOrUpdateProduct } = useProducts();
  const dispatch = useDispatch();
  const adminProducts = useSelector((state) => state.admin.products);
  const orders = useSelector((state) => {
    return state.admin.orders;
  });
  const users = useSelector((state) => {
    return state.admin.users;
  });

  useEffect(() => {
    dispatch({
      type: "LOAD_ADMIN_PRODUCTS",
      payload: products,
    });
  }, [products]);

  const sortedProductsWithStats = useMemo(() => {
    const ordersPerProduct = {};
    orders?.forEach((order) => {
      order.products.forEach(({ quantity, id }) => {
        ordersPerProduct[id] = [
          ...(ordersPerProduct[id] || []),
          [users[order.userId].fname, quantity, order.date],
        ];
      });
    });
    const sortedProduct = Object.values(adminProducts).sort((a, b) => {
      const hasA = !!a.createDate;
      const hasB = !!b.createDate;

      if (!hasA && !hasB) return 0;
      if (!hasA) return 1;
      if (!hasB) return -1;

      const ta = a.createDate.seconds * 1000 + a.createDate.nanoseconds / 1e6;
      const tb = b.createDate.seconds * 1000 + b.createDate.nanoseconds / 1e6;
      return ta - tb;
    });

    sortedProduct.forEach((product) => {
      product.boughtBy = ordersPerProduct[product.id];
    });
    return sortedProduct;
  }, [users, adminProducts]);

  const addNew = async () => {
    const id = await getFirebaseUniqueId();
    dispatch({
      type: "ADD_PRODUCT",
      payload: id,
    });
  };
  return (
    <div>
      {sortedProductsWithStats.length > 0 &&
        sortedProductsWithStats.map((product, index) => {
          return (
            <ProductInfo
              key={product.id}
              product={product}
              onUpdate={(updatedData) =>
                addOrUpdateProduct(product.id, updatedData, index)
              }
            />
          );
        })}
      <button onClick={addNew}>Add new</button>
    </div>
  );
};

export default Products;

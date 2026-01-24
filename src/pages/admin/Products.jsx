import { ProductInfo } from "@/admin_components";
import { useSelector, useDispatch } from "react-redux";
import { upsertProduct, getFirebaseUniqueId } from "@/firebase";
import { useEffect, useMemo, useRef } from "react";
import { mapObjectToArray } from "@/utils";

// Products uses the local redux firebase
// Any updates done by other admins or directly on firebase will not be seen
// untill refreshing the site. This is acceptable as products shuold only
// be added/edits by a single admin
// For deleting products, access firebase->delete product->refresh the page

const Products = () => {
  const dispatch = useDispatch();
  const productsMap = useSelector((state) => state.data.products);
  const adminProducts = useSelector((state) => state.admin.products);
  const orders = useSelector((state) => {
    return state.admin.orders;
  });
  const users = useSelector((state) => {
    return state.admin.users;
  });

  const products = useMemo(() => mapObjectToArray(productsMap), [productsMap]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (products.length > 0 && !hasLoadedRef.current) {
      dispatch({
        type: "LOAD_ADMIN_PRODUCTS",
        payload: products,
      });
      hasLoadedRef.current = true;
    }
  }, [products, dispatch]);

  const sortedProductsWithStats = useMemo(() => {
    const ordersPerProduct = {};
    orders?.forEach((order) => {
      (order.products || []).forEach(({ quantity, id }) => {
        const user = users?.[order.userId];
        const entry = [
          user ? user.fname : "Unknown",
          quantity,
          order.date,
          order.timestamp,
        ];
        ordersPerProduct[id] = ordersPerProduct[id] || [];
        ordersPerProduct[id].push(entry);
        ordersPerProduct[id].sort((a, b) => {
          return (a[3] || 0) - (b[3] || 0);
        });
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
      const list = ordersPerProduct[product.id] || [];
      // ensure boughtBy is always an array and sorted by timestamp (4th item) or fallback
      product.boughtBy = list.slice().sort((a, b) => {
        const ta = Array.isArray(a) ? a[3] : a?.timestamp || 0;
        const tb = Array.isArray(b) ? b[3] : b?.timestamp || 0;
        return ta - tb;
      });
    });
    return sortedProduct;
  }, [users, adminProducts]);

  const addOrUpdateProduct = async (id, updatedData, index) => {
    await upsertProduct(id, updatedData, index);
    // Update Redux state locally to avoid re-fetching from Firebase
    dispatch({
      type: "UPDATE_PRODUCT",
      payload: { id, data: updatedData },
    });
  };

  const addNew = async () => {
    const id = await getFirebaseUniqueId();
    dispatch({
      type: "ADD_PRODUCT",
      payload: id,
    });
  };
  return (
    <div>
      {sortedProductsWithStats.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No products yet</div>
      ) : (
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
        })
      )}
      <button onClick={addNew}>Add new</button>
    </div>
  );
};

export default Products;

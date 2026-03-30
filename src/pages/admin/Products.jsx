import React from "react";

import { ProductInfo } from "@/admin_components";
import { useSelector, useDispatch } from "react-redux";
import { upsertProduct } from "@/adapters";
import { useEffect, useMemo, useRef } from "react";
import { mapObjectToArray } from "@/utils";

const Products = () => {
  const dispatch = useDispatch();
  const productsMap = useSelector((state) => state.data.products);
  const adminProducts = useSelector((state) => state.admin.products);
  const orders = useSelector((state) => state.admin.orders);
  const users = useSelector((state) => state.admin.users);

  const products = useMemo(() => mapObjectToArray(productsMap), [productsMap]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (products.length > 0 && !hasLoadedRef.current) {
      dispatch({ type: "LOAD_ADMIN_PRODUCTS", payload: products });
      hasLoadedRef.current = true;
    }
  }, [products, dispatch]);

  const productsWithStats = useMemo(() => {
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
        ordersPerProduct[id].sort((a, b) => (a[3] || 0) - (b[3] || 0));
      });
    }); // TODO - get directly from backend instead of calculating on the fly. RestAPI - /stats/product/:title. Firebase - implement this calculation in the adapter.
    const productList = Object.values(adminProducts);
    productList.forEach((product) => {
      product.boughtBy = ordersPerProduct[product.title] || [];
    });
    return productList;
  }, [users, adminProducts]);

  const addOrUpdateProduct = async (oldTitle, updatedData, index) => {
    const newTitle = updatedData.title;
    if (newTitle !== oldTitle && adminProducts[newTitle]) return; // title already exists
    await upsertProduct(updatedData, index);
    dispatch({
      type: "UPSERT_PRODUCT",
      payload: { oldTitle, product: updatedData },
    });
  };

  const addNew = () => {
    let title = "New Product";
    let counter = 1;
    while (adminProducts[title]) {
      title = `New Product (${counter++})`;
    }
    dispatch({ type: "ADD_PRODUCT", payload: { title } });
  };

  return (
    <div className="card-subpage">
      {productsWithStats.length === 0 ? (
        <div className="message-text">No products yet</div>
      ) : (
        productsWithStats.map((product, index) => (
          <ProductInfo
            key={product.title}
            product={product}
            onUpdate={(updatedData) =>
              addOrUpdateProduct(product.title, updatedData, index)
            }
          />
        ))
      )}
      <button className="btn-teal btn-small" onClick={addNew}>
        Add New
      </button>
    </div>
  );
};

export default Products;

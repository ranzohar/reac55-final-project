import React from "react";

import { ProductInfo } from "@/admin_components";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getOrdersForProduct,
} from "@/adapters";
import { useEffect, useMemo, useState } from "react";
import { mapObjectToArray } from "@/utils";
import { Spinner } from "@/components";

const Products = () => {
  const dispatch = useDispatch();
  const productsMap = useSelector((state) => state.data.products);
  const adminDrafts = useSelector((state) => state.admin.drafts);
  const boughtByMap = useSelector((state) => state.admin.boughtByMap);

  const products = useMemo(() => mapObjectToArray(productsMap), [productsMap]);

  useEffect(() => {
    if (products.length === 0) return;
    const unsubs = products.map((product) =>
      getOrdersForProduct(product.title, (entries) => {
        dispatch({
          type: "UPDATE_BOUGHT_BY",
          payload: { id: product.id, entries },
        });
      }),
    );
    return () => unsubs.forEach((unsub) => unsub?.());
  }, [products, dispatch]);

  // Show spinner only on first load — once every product has cached data in Redux,
  // navigating away and back renders instantly without re-fetching.
  const isBoughtByLoading =
    products.length > 0 && !products.every((p) => p.id in boughtByMap);

  const productsWithStats = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        boughtBy: Array.isArray(boughtByMap[product.id])
          ? boughtByMap[product.id]
          : [],
      })),
    [products, boughtByMap],
  );

  const draftList = useMemo(
    () => Object.values(adminDrafts).sort((a, b) => a.createdAt - b.createdAt),
    [adminDrafts],
  );

  const handleSaveProduct = async (id, fields) => {
    await updateProduct(id, fields);
    console.log("Saved product with id:", id, "and fields:", fields);
    dispatch({ type: "UPDATE_PRODUCT", payload: { id, product: fields } });
  };

  const [lastSavedId, setLastSavedId] = useState(null);

  useEffect(() => {
    if (!lastSavedId) return;
    const t = setTimeout(() => setLastSavedId(null), 3000);
    return () => clearTimeout(t);
  }, [lastSavedId]);

  const handleSaveDraft = async (localId, fields) => {
    console.log("Saving draft with localId:", localId, "and fields:", fields);
    const savedProduct = await createProduct(fields);
    setLastSavedId(savedProduct.id);
    dispatch({ type: "SAVE_DRAFT", payload: { localId } });
    dispatch({ type: "ADD_PRODUCT", payload: { product: savedProduct } });
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    dispatch({ type: "DELETE_PRODUCT", payload: { id } });
  };

  const handleDraftChange = (localId, fields) => {
    dispatch({ type: "UPDATE_DRAFT", payload: { localId, fields } });
  };

  const handleDeleteDraft = (localId) => {
    dispatch({ type: "DELETE_DRAFT", payload: { localId } });
  };

  const addNew = () => {
    dispatch({ type: "ADD_DRAFT" });
  };

  if (isBoughtByLoading) return <Spinner />;

  const isEmpty = productsWithStats.length === 0 && draftList.length === 0;

  return (
    <div className="card-subpage">
      {isEmpty ? (
        <div className="message-text">No products yet</div>
      ) : (
        <>
          {productsWithStats.map((product) => (
            <ProductInfo
              key={product.id}
              product={product}
              onSave={(fields) => handleSaveProduct(product.id, fields)}
              onDelete={() => handleDeleteProduct(product.id)}
              initialFeedback={
                lastSavedId === product.id
                  ? { type: "success", message: "Saved!" }
                  : null
              }
            />
          ))}
          {draftList.map((draft) => (
            <ProductInfo
              key={draft.localId}
              product={draft}
              onSave={(fields) => handleSaveDraft(draft.localId, fields)}
              onDelete={() => handleDeleteDraft(draft.localId)}
              onChange={(fields) => handleDraftChange(draft.localId, fields)}
              className="card-product--draft"
            />
          ))}
        </>
      )}
      <button className="btn-teal btn-small" onClick={addNew}>
        Add New
      </button>
    </div>
  );
};

export default Products;

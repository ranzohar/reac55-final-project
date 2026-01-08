import ProductInfo from "../../admin_components/ProductInfo";
import { useState, useEffect } from "react";
import { getProductsData } from "../../firebase/doc-utils";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const Products = () => {
  const { adminId } = useParams();
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = getProductsData(setProducts);
    return () => unsubscribe();
  }, [adminId]);

  useEffect(() => {
    dispatch({
      type: "LOAD",
      payload: { products },
    });
  }, [products]);

  return (
    <div>
      <h3>Product Info:</h3>
      {products.map((product, index) => (
        <ProductInfo key={index} productId={product.id}></ProductInfo>
      ))}
    </div>
  );
};

export default Products;

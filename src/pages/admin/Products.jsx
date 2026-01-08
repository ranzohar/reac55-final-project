import ProductInfo from "../../admin_components/ProductInfo";
import { useState, useEffect } from "react";
import { getProductsData } from "../../firebase/doc-utils";
import { useDispatch } from "react-redux";

const Products = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO - all components get the userAuth and load data if it changes. If it's not logged in clear firebase.
    console.log("Getting categories");
    getProductsData(setProducts);
  }, []);

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

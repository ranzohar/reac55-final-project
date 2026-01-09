import ProductInfo from "../../admin_components/ProductInfo";
import useProducts from "../../firebase/hooks/useProducts"; // import your updated hook
import { useParams } from "react-router-dom";

const Products = () => {
  const { adminId } = useParams();
  const { products, updateExistingProduct } = useProducts(adminId);

  return (
    <>
      {products.map((product) => (
        <ProductInfo
          key={product.id}
          product={product}
          onUpdate={(updatedData) =>
            updateExistingProduct(product.id, updatedData)
          }
        />
      ))}
    </>
  );
};

export default Products;

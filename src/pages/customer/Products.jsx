import ProductInfo from "../../customer_components/ProductInfo";
import useProducts from "../../firebase/hooks/useProducts";
import { useParams } from "react-router-dom";

const Products = () => {
  const { customerId } = useParams();
  const { products } = useProducts(customerId);
  console.log(products);

  return (
    <div>
      {products.map((product, index) => {
        return <ProductInfo key={index} product={product} />;
      })}
    </div>
  );
};

export default Products;

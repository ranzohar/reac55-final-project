import ProductInfo from "../../admin_components/ProductInfo";
import useProducts from "../../firebase/hooks/useProducts"; // import your updated hook
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getFirebaseUniqueId } from "../../firebase/doc-utils";

const Products = () => {
  const { adminId } = useParams();
  const { products, addOrUpdateProduct } = useProducts(adminId, true);
  const dispatch = useDispatch();
  const adminProducts = useSelector((state) => state.admin.products);

  if (products.length === 0) {
    return null;
  }

  const sortedProducts = Object.values(adminProducts).sort((a, b) => {
    const hasA = !!a.createDate;
    const hasB = !!b.createDate;

    if (!hasA && !hasB) return 0; // both missing → equal
    if (!hasA) return 1; // a missing → a goes after b
    if (!hasB) return -1; // b missing → b goes after a

    const ta = a.createDate.seconds * 1000 + a.createDate.nanoseconds / 1e6;
    const tb = b.createDate.seconds * 1000 + b.createDate.nanoseconds / 1e6;
    return ta - tb; // asc: oldest → newest
  });

  const addNew = async () => {
    const id = await getFirebaseUniqueId();
    dispatch({
      type: "ADD_PRODUCT",
      payload: id,
    });
  };
  console.log(sortedProducts);
  return (
    <div>
      {sortedProducts.map((product) => {
        return (
          <ProductInfo
            key={product.id}
            product={product}
            onUpdate={(updatedData) =>
              addOrUpdateProduct(product.id, updatedData)
            }
          />
        );
      })}
      <button onClick={addNew}>Add new</button>
    </div>
  );
};

export default Products;

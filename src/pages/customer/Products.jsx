import { useState, useMemo } from "react";
import ProductInfo from "../../customer_components/ProductInfo";
import useProducts from "../../firebase/hooks/useProducts";
import FilterTab from "./FilterTab";
import { useSelector } from "react-redux";
const Products = () => {
  const { products } = useProducts();
  const publicOrders = useSelector((state) => {
    // TODO - check if doc doesn't exist nothing breaks
    return state.customer.publicOrders;
  });
  const [priceLimit, setPriceLimit] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = +product.price.replace(/^\D/, "");
      const matchesCategory = categoryFilter
        ? product.categoryId === categoryFilter
        : true;
      const matchesTitle = titleFilter
        ? product.title.toLowerCase().includes(titleFilter.toLowerCase())
        : true;

      return price <= priceLimit && matchesCategory && matchesTitle;
    });
  }, [products, priceLimit, categoryFilter, titleFilter]);

  return (
    <div>
      <FilterTab
        priceLimit={priceLimit}
        setPriceLimit={setPriceLimit}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        titleFilter={titleFilter}
        setTitleFilter={setTitleFilter}
      />

      {filteredProducts.map((product, index) => {
        return (
          <ProductInfo
            key={index}
            product={product}
            bought={publicOrders?.[product.id] ?? 0}
          />
        );
      })}
    </div>
  );
};

export default Products;

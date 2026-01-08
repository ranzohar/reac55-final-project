import { useState } from "react";
import { useSelector } from "react-redux";

const ProductInfo = ({ productId }) => {
  const [productUpdate, setNameUpdate] = useState({});
  const { title, price, link, category } =
    useSelector((state) => state.data.products?.[productId]) || {};
  return (
    <div>
      Title: {title} <br />
      Price: {price} <br />
      Link to pic: <img src={link} className="w-48 h-auto" /> <br />
      Category: {category || "UNDEFINED"} <br />
    </div>
  );
};

export default ProductInfo;

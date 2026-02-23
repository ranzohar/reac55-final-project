import React from "react";

const ProductImage = ({ src }) => {
  if (!src) return null;
  return (
    <div className="flex-column product-image-cell">
      <img src={src} className="" />
    </div>
  );
};

export default ProductImage;

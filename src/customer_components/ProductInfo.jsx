import { useDispatch, useSelector } from "react-redux";
import { LINK_TO_PIC } from "@/firebase-key-constants";

const ProductInfo = ({ product, bought }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.customer.cart);
  const quantity = cart[product.id] ?? 0;

  const updateCart = (updatedQuantity) => {
    dispatch({
      type: "UPDATE_CART",
      payload: {
        productId: product.id,
        quantity: updatedQuantity,
        price: +product.price.replace(/^\D/, ""),
        removeFromCart: updatedQuantity === 0,
      },
    });
  };

  const increment = () => {
    updateCart(quantity + 1);
  };

  const decrement = () => {
    updateCart(Math.max(0, quantity - 1));
  };

  return (
    <div className="card-product-info">
      {/* Product Info */}
      <div className="flex-column">
        <h4>{product.title}</h4>
        <span className="textsize-s">{product.description}</span>
        <span>Price: {product.price}</span>
        <span>In stock: ???</span>
        {/* Counter */}
        <div className="inline">
          {/* Minus icon */}
          <svg
            onClick={decrement}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="quantity-icon"
          >
            <rect x="4" y="11" width="16" height="2" />
          </svg>

          <div className="quantity-number">{quantity}</div>

          {/* Plus icon */}
          <svg
            onClick={increment}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="quantity-icon"
          >
            <rect x="11" y="4" width="2" height="16" />
            <rect x="4" y="11" width="16" height="2" />
          </svg>
        </div>
      </div>

      {/* Image */}
      <div className="flex-column product-image-cell">
        <img
          src={product[LINK_TO_PIC] || null}
          alt={product.title}
          className=""
        />
      </div>

      {/* Bought */}
      <div>Bought: {bought}</div>
    </div>
  );
};

export default ProductInfo;

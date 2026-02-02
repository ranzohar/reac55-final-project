import { useContext } from "react";
import { coinSign } from "@/ContextWrapper";

const CartProduct = ({ name, productId, quantity, price, updateCart }) => {
  const [currentCoinSign] = useContext(coinSign);

  const total = +quantity * +price;

  const increment = () => updateCart(quantity + 1);
  const decrement = () => updateCart(Math.max(0, quantity - 1));

  return (
    <div key={productId} className="cart">
      {/* Name, can shrink and truncate */}
      <span className="textsize-s">{name} - </span>

      {/* Increment button */}
      <button onClick={increment} className="btn-small btn-grey">
        +
      </button>

      {/* Quantity */}
      <span className="textsize-s">{quantity}</span>

      {/* Decrement button */}
      <button onClick={decrement} className="btn-small btn-grey">
        -
      </button>

      {/* Total, can shrink and truncate */}
      <span className="textsize-s">
        units - Total:{currentCoinSign}
        {total}
      </span>

      {/* Remove button */}
      <button onClick={() => updateCart(0, true)} className="btn-small btn-red">
        X
      </button>
    </div>
  );
};

export default CartProduct;

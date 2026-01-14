const CartProduct = ({
  name,
  productId,
  quantity,
  price,
  pricePrefix,
  updateCart,
}) => {
  const total = +quantity * +price;

  const increment = () => updateCart(quantity + 1);
  const decrement = () => updateCart(Math.max(0, quantity - 1));

  return (
    <div key={productId} className="flex items-center gap-1 min-w-0">
      {/* Name, can shrink and truncate */}
      <span className="shrink truncate">{name} - </span>

      {/* Increment button */}
      <button
        onClick={increment}
        className="inline-flex items-center justify-center text-[8px] leading-none p-0 m-0"
        style={{ width: "10px", height: "10px" }}
      >
        +
      </button>

      {/* Quantity */}
      <span className="px-1 shrink-0">{quantity}</span>

      {/* Decrement button */}
      <button
        onClick={decrement}
        className="inline-flex items-center justify-center text-[8px] leading-none p-0 m-0"
        style={{ width: "10px", height: "10px" }}
      >
        -
      </button>

      {/* Total, can shrink and truncate */}
      <span className="ml-2 shrink truncate">
        units - Total: {pricePrefix}
        {total}
      </span>

      {/* Remove button */}
      <button
        onClick={() => updateCart(0, true)}
        className="inline-flex items-center justify-center text-[8px] leading-none p-0 m-0 text-red-800"
        style={{ width: "10px", height: "10px" }}
      >
        X
      </button>
    </div>
  );
};

export default CartProduct;

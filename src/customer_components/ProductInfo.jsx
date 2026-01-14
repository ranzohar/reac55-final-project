import { useDispatch, useSelector } from "react-redux";

const ProductInfo = ({ product }) => {
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
    <div className="max-w-xl border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-900 shadow-sm">
      <div className="grid grid-cols-3 gap-4">
        {/* Product Info */}
        <div className="flex flex-col justify-center gap-3 col-span-1">
          <h3 className="text-2xl font-bold">{product.title}</h3>
          <span>{product.description}</span>
          <span>Price: {product.price}</span>
          <span>In stock: ???</span>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={product.link_to_pic}
            alt={product.title}
            className="h-48 w-auto object-cover rounded-lg"
          />
        </div>

        {/* Bought */}
        <div className="flex items-center justify-center text-lg font-semibold">
          Bought: ???
        </div>
      </div>

      {/* Counter */}
      <div className="flex mt-4 gap-2 items-center">
        {/* Minus icon */}
        <svg
          onClick={decrement}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 cursor-pointer text-white"
        >
          <rect x="4" y="11" width="16" height="2" />
        </svg>

        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-lg font-medium">
          {quantity}
        </div>

        {/* Plus icon */}
        <svg
          onClick={increment}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 cursor-pointer text-white"
        >
          <rect x="11" y="4" width="2" height="16" />
          <rect x="4" y="11" width="16" height="2" />
        </svg>
      </div>
    </div>
  );
};

export default ProductInfo;

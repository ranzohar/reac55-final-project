import { useSelector, useDispatch } from "react-redux";
import CartProduct from "./CartProduct";
import { addOrderToUser } from "../firebase/doc-utils";
import { useParams } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { cart, publicOrders } = useSelector((state) => state.customer);
  console.log(publicOrders);

  const products = useSelector((state) => state.data.products);
  const allowOthersToSeeOrders = useSelector(
    (state) => state.customer.user["allow others to see orders"]
  );
  const updateCart = (productId, quantity, price, removeFromCart) => {
    dispatch({
      type: "UPDATE_CART",
      payload: {
        productId,
        quantity,
        price,
        removeFromCart,
      },
    });
  };

  const orderDataFromCart = (cart) => {
    const { price: _, ...orderMap } = cart;

    const products = Object.entries(orderMap).map(([productId, quantity]) => ({
      id: productId,
      quantity,
    }));

    return { products };
  };
  const order = async () => {
    if (Object.keys(cart).length === 0) {
      return;
    }
    await addOrderToUser(
      customerId,
      orderDataFromCart(cart),
      allowOthersToSeeOrders,
      publicOrders
    );
    dispatch({
      type: "CLEAR_CART",
    });
  };
  return (
    <>
      <h3>Cart:</h3>
      <br />
      {Object.entries(cart).map(([productId, quantity]) => {
        if (!(productId in products)) {
          return null;
        }
        const rawPrice = products[productId].price;
        const pricePrefix = rawPrice[0].match(/\D/) ? rawPrice[0] : "";
        const price = +rawPrice.replace(/^\D/, "");

        return (
          <CartProduct
            key={productId}
            name={products[productId].title}
            quantity={quantity}
            price={price}
            updateCart={(quantity, removeFromCart) =>
              updateCart(productId, quantity, price, removeFromCart)
            }
            pricePrefix={pricePrefix}
            productId={productId}
          />
        );
      })}
      <br />
      <br />
      <strong>Total: {cart.price ?? 0}</strong>
      <br />
      <button className="bg-green-800 w-20" onClick={order}>
        {" "}
        Order
      </button>
    </>
  );
};

export default Cart;

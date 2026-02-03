import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import CartProduct from "./CartProduct";
import { addOrderToUser } from "@/firebase";
import { ALLOW_OTHERS } from "@/firebase-key-constants";
import { Price } from "@/components";

const Cart = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { cart, publicOrders } = useSelector((state) => state.customer);
  const products = useSelector((state) => state.data.products);
  const allowOthersToSeeOrders = useSelector((state) =>
    state.customer.user ? state.customer.user[ALLOW_OTHERS] : false,
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
    if (!cart || typeof cart !== "object") return { products: [] };
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
      publicOrders,
    );
    dispatch({
      type: "CLEAR_CART",
    });
  };
  return (
    <>
      <h4>Cart:</h4>
      <br />
      {Object.entries(cart).map(([productId, quantity]) => {
        if (!(productId in products)) {
          return null;
        }
        const price = products[productId].price;

        return (
          <CartProduct
            key={productId}
            name={products[productId].title}
            quantity={quantity}
            price={price}
            updateCart={(quantity, removeFromCart) =>
              updateCart(productId, quantity, price, removeFromCart)
            }
            productId={productId}
          />
        );
      })}
      <br />
      <br />
      <strong>
        Total: <Price amount={Number(cart.price ?? 0)} />
      </strong>
      <br />
      <button className="btn-green" onClick={order}>
        {" "}
        Order
      </button>
    </>
  );
};

export default Cart;

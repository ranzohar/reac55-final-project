import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { addOrder, getOrders } from "@/adapters";
import { Price } from "@/components";

import CartProduct from "./CartProduct";

const Cart = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { cart } = useSelector((state) => state.customer);
  const products = useSelector((state) => state.data.products);
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
    const products = Object.entries(orderMap).map(([title, quantity]) => ({
      title,
      quantity,
    }));
    return { products };
  };
  const order = async () => {
    if (Object.keys(cart).length === 0) {
      return;
    }
    await addOrder(customerId, orderDataFromCart(cart));
    dispatch({ type: "CLEAR_CART" });
    getOrders(customerId, (data) => {
      dispatch({ type: "CUSTOMER_LOAD", payload: { orders: data } });
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
      <button className="btn-order" onClick={order}>
        {" "}
        Order
      </button>
    </>
  );
};

export default Cart;

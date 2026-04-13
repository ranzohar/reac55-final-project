import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { addOrder, getOrders, getPublicOrders } from "@/adapters";
import { Price } from "@/components";

import CartProduct from "./CartProduct";

const Cart = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { cart } = useSelector((state) => state.customer);
  const products = useSelector((state) => state.data.products);
  const productsByTitle = Object.fromEntries(
    Object.values(products).map((p) => [p.title, p]),
  );
  const updateCart = (productTitle, quantity, price, removeFromCart) => {
    dispatch({
      type: "UPDATE_CART",
      payload: {
        productTitle,
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
    getPublicOrders((data) => {
      const { id, ...totals } = data[0] ?? {};
      dispatch({ type: "CUSTOMER_LOAD", payload: { publicOrders: totals } });
    });
  };
  return (
    <>
      <h4>Cart:</h4>
      <br />
      {Object.entries(cart).map(([productTitle, quantity]) => {
        if (!(productTitle in productsByTitle)) {
          return null;
        }
        const price = productsByTitle[productTitle].price;
        return (
          <CartProduct
            key={productTitle}
            name={productTitle}
            quantity={quantity}
            price={price}
            updateCart={(quantity, removeFromCart) =>
              updateCart(productTitle, quantity, price, removeFromCart)
            }
            productId={productTitle}
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

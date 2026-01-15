const INITIAL_STATE = {
  cart: { price: 0 },
  user: {},
  publicOrders: {},
};

const customerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CUSTOMER_LOAD": {
      const { user, publicOrders } = action.payload;
      return {
        ...state,
        user: user ?? state.user,
        publicOrders: publicOrders ?? state.publicOrders,
      };
    }
    case "UPDATE_CART": {
      const { productId, quantity, price, removeFromCart } = action.payload;
      let cart = { ...state.cart };
      cart.price =
        cart.price + price * quantity - (cart[productId] ?? 0) * price;
      if (removeFromCart) {
        delete cart[productId];
      } else {
        cart[productId] = quantity;
      }
      return { ...state, cart };
    }
    case "CLEAR_CART":
      return { ...state, cart: INITIAL_STATE.cart };
    default:
      return state;
  }
};

export default customerReducer;

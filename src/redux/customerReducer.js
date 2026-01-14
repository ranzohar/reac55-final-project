const INITIAL_STATE = {
  cart: { price: 0 },
  user: [],
};

const customerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return { ...state, user: action.payload };
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

const INITIAL_STATE = {
  cart: { price: 0 },
  user: {},
  orders: [],
  publicOrders: {},
};

const customerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CUSTOMER_LOAD": {
      const { user, orders, publicOrders } = action.payload;
      return {
        ...state,
        user: user ?? state.user,
        orders: orders ?? state.orders,
        publicOrders: publicOrders ?? state.publicOrders,
      };
    }
    case "UPDATE_CART": {
      const { productTitle, quantity, price, removeFromCart } = action.payload;
      let cart = { ...state.cart };
      cart.price =
        cart.price + price * quantity - (cart[productTitle] ?? 0) * price;
      if (removeFromCart) {
        delete cart[productTitle];
      } else {
        cart[productTitle] = quantity;
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

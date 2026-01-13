const initialState = {
  cart: [],
  user: [],
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return { ...state, user: action.payload };
    case "ADD_TO_CART":
      return state;
    case "REMOVE_FROM_CART":
      return state;
    case "ORDER":
      return state;
    default:
      return state;
  }
};

export default customerReducer;

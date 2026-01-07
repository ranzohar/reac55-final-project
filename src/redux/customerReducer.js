// includes cart and orders TODO - every user should have priviledges to see only his own orders
const initialState = {
  details: { fname: "", lname: "", username: "", password: "" }, //TODO keep password out of database
  cart: [], // products
  orders: [], // products + date
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return state;
    case "REMOVE_FROM_CART":
      return state;
    case "ORDER_MADE":
      return state;
    case "UPDATE_DETAILS": // on load when entering username/password. On create new use. On update details page
      return state;
    default:
      return state;
  }
};

export default customerReducer;

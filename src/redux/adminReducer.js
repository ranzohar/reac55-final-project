import { v4 as uuidv4 } from "uuid";

const initialState = {
  pendingProducts: {}, //{ uuid: title, price, link_to_pic, description, category, quantity },
};

const EMPTY_PRODUCT = {
  title: "",
  price: "",
  link_to_pic: "",
  description: "",
  category: "",
  quantity: "",
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "NEW_PRODUCT":
      return {
        ...state,
        pendingProducts: {
          ...state.pendingProducts,
          [uuidv4()]: EMPTY_PRODUCT,
        },
      };

    case "REMOVE_PENDING_PRODUCT":
      const pendingProducts = { ...state.pendingProducts };
      delete pendingProducts[action.payload];
      return {
        ...state,
        pendingProducts,
      };

    default:
      return state;
  }
};

export default adminReducer;

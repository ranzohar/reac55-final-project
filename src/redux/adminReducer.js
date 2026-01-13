const initialState = {
  products: {},
  // This adds a layer of new products on top of firebase existing product. They
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_ADMIN_PRODUCTS": {
      const updatedProducts = { ...state.products };
      action.payload.forEach((product) => {
        updatedProducts[product.id] = { ...product };
      });
      return {
        ...state,
        products: updatedProducts,
      };
    }
    case "ADD_PRODUCT": {
      const updatedProducts = {
        ...state.products,
        [action.payload]: { id: action.payload },
      };
      return {
        ...state,
        products: updatedProducts,
      };
    }
    default:
      return state;
  }
};

export default adminReducer;

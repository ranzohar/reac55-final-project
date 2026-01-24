const initialState = {
  categories: {}, // { [categoryId]: { name } }
  products: {}, // { [productId]: { title, price, link, category, description, createDate } }
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD": {
      const { products: payloadProducts, categories: payloadCategories } =
        action.payload;

      return {
        ...state,
        products: payloadProducts
          ? Object.fromEntries(
              payloadProducts.map((product) => [product.id, { ...product }]),
            )
          : state.products,
        categories: payloadCategories
          ? Object.fromEntries(
              payloadCategories.map((category) => [
                category.id,
                { ...category },
              ]),
            )
          : state.categories,
      };
    }

    case "UPDATE_PRODUCT": {
      const { id, data } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          [id]: {
            ...state.products[id],
            ...data,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default dataReducer;

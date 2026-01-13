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
        products: payloadProducts?.length
          ? Object.fromEntries(
              payloadProducts.map((product) => [product.id, { ...product }])
            )
          : state.products,
        categories: payloadCategories?.length
          ? Object.fromEntries(
              payloadCategories.map((category) => [
                category.id,
                { ...category },
              ])
            )
          : state.categories,
      };
    }

    default:
      return state;
  }
};

export default dataReducer;

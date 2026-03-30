const initialState = {
  categories: {}, // { [categoryId]: { name } }
  products: {}, // { [title]: { title, price, link, category, description, createDate } }
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
              payloadProducts.map((product) => [product.title, { ...product }]),
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

    case "ADD_CATEGORY": {
      const { category } = action.payload;
      return {
        ...state,
        categories: {
          ...state.categories,
          [category.id]: { ...category },
        },
      };
    }

    case "REMOVE_CATEGORY": {
      const { id } = action.payload;
      const { [id]: _, ...rest } = state.categories;
      return { ...state, categories: rest };
    }

    case "UPDATE_CATEGORY": {
      const { category } = action.payload;
      return {
        ...state,
        categories: {
          ...state.categories,
          [category.id]: { ...state.categories[category.id], ...category },
        },
      };
    }

    case "UPSERT_PRODUCT": {
      const { oldTitle, product } = action.payload;
      const products = Object.fromEntries(
        Object.entries(state.products).map(([key, val]) =>
          key === oldTitle ? [product.title, product] : [key, val]
        )
      );
      return { ...state, products };
    }

    default:
      return state;
  }
};

export default dataReducer;

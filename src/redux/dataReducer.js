const hashTitle = (title) => {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  }
  // Bit-mixing finalizer: ensures close hash inputs produce distant outputs
  h ^= h >>> 16;
  h = Math.imul(h, 0x45d9f3b);
  h ^= h >>> 15;
  return h >>> 0;
};

export const titleToColor = (title, lightness = 50) => {
  const hue = hashTitle(title) % 360;
  return `hsl(${hue}, 65%, ${lightness}%)`;
};
export const getColorLightness = (isDark) => (isDark ? 20 : 42);
const initialState = {
  categories: {}, // { [id]: { id, name } }
  products: {}, // { [id]: { title, price, link, categoryId, description, createDate, color } } — color derived from title via golden-ratio hash ?TODO? - change to id?
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD": {
      const { products: payloadProducts, categories: payloadCategories } =
        action.payload;
      // console.log("LOAD action:", {
      //   payloadProducts: JSON.stringify(payloadProducts),
      //   payloadCategories: JSON.stringify(payloadCategories),
      // });
      return {
        ...state,
        products: payloadProducts
          ? Object.fromEntries(
              payloadProducts.map((product) => [
                product.id,
                { ...product, color: titleToColor(product.title) },
              ]),
            )
          : state.products,
        categories: payloadCategories
          ? Object.fromEntries(
              payloadCategories
                .filter((category) => category.id)
                .map((category) => [category.id, { ...category }]),
            )
          : state.categories,
      };
    }

    case "ADD_CATEGORY": {
      const { category } = action.payload;
      if (!category?.id) return state;
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
      const { category } = action.payload; // { id, name }
      return {
        ...state,
        categories: {
          ...state.categories,
          [category.id]: { ...state.categories[category.id], ...category },
        },
      };
    }

    case "ADD_PRODUCT": {
      const { product } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          [product.id]: { ...product, color: titleToColor(product.title) },
        },
      };
    }

    case "UPDATE_PRODUCT": {
      const { id, product } = action.payload;
      console.log("Update product action:", {
        id,
        product,
        state: JSON.stringify(state.products),
      });

      return {
        ...state,
        products: {
          ...state.products,
          [id]: { ...state.products[id], ...product, id },
        },
      };
    }

    case "DELETE_PRODUCT": {
      const { id } = action.payload;
      const products = Object.fromEntries(
        Object.entries(state.products).filter(([, p]) => p.id !== id),
      );
      return { ...state, products };
    }

    default:
      return state;
  }
};

export default dataReducer;

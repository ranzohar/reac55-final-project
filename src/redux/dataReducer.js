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
  categories: {}, // { [name]: { name } }
  products: {}, // { [title]: { title, price, link, category, description, createDate, color } } — color derived from title via golden-ratio hash
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
              payloadProducts.map((product) => [
                product.title,
                { ...product, color: titleToColor(product.title) },
              ]),
            )
          : state.products,
        categories: payloadCategories
          ? Object.fromEntries(
              payloadCategories.map((category) => [
                category.name,
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
          [category.name]: { ...category },
        },
      };
    }

    case "REMOVE_CATEGORY": {
      const { name } = action.payload;
      const { [name]: _, ...rest } = state.categories;
      return { ...state, categories: rest };
    }

    case "UPDATE_CATEGORY": {
      const { category, oldName } = action.payload;
      const { [oldName]: _, ...rest } = state.categories;
      return {
        ...state,
        categories: { ...rest, [category.name]: { ...category } },
      };
    }

    case "UPSERT_PRODUCT": {
      const { oldTitle, product } = action.payload;
      const existing = state.products[oldTitle];
      const color = existing?.color ?? titleToColor(product.title);
      const productWithColor = { ...product, color };
      if (existing) {
        const products = Object.fromEntries(
          Object.entries(state.products).map(([key, val]) =>
            key === oldTitle ? [product.title, productWithColor] : [key, val],
          ),
        );
        return { ...state, products };
      }
      return {
        ...state,
        products: { ...state.products, [product.title]: productWithColor },
      };
    }

    default:
      return state;
  }
};

export default dataReducer;

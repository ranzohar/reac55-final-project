const GOLDEN_ANGLE = 137.508;

const hashTitle = (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const titleToColor = (title) => {
  const hue = (hashTitle(title) * GOLDEN_ANGLE) % 360;
  return `hsl(${hue.toFixed(1)}, 65%, 50%)`;
};

const initialState = {
  categories: {}, // { [categoryId]: { name } }
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

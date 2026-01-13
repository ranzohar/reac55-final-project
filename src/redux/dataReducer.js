const initialState = {
  categories: {}, // { [categoryId]: { name } }
  products: {}, // { [productId]: { title, price, link, category, description, createDate } }
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD": {
      const { products: payloadProducts, categories: payloadCategories } =
        action.payload;

      const products =
        payloadProducts && payloadProducts.length > 0
          ? payloadProducts.reduce((acc, product) => {
              console.log(payloadProducts);
              const {
                id,
                title,
                price,
                link_to_pic,
                categoryId,
                description,
                createDate,
                color,
              } = product;
              acc[id] = {
                title,
                price,
                link_to_pic,
                categoryId,
                description,
                createDate,
                color,
              };
              return acc;
            }, {})
          : state.products;

      const categories =
        payloadCategories && payloadCategories.length > 0
          ? payloadCategories.reduce((acc, category) => {
              const { id, name } = category;
              acc[id] = { name };
              return acc;
            }, {})
          : state.categories;
      return { ...state, products, categories };
    }

    default:
      return state;
  }
};

export default dataReducer;

const initialState = {
  users: {}, //details + join date per user ID
  orders: [],
  categories: {}, // names
  products: [], // id, title, category, description, price link to pic per ID TODO add qunatity
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD": {
      const {
        users: payloadUsers,
        products: payloadProducts,
        categories: payloadCategories,
        orders: payloadOrders,
      } = action.payload;

      const users =
        payloadUsers && payloadUsers.length > 0
          ? payloadUsers.reduce((acc, user) => {
              const { username, fname, lname, joined } = user;
              const date = new Date(joined.seconds * 1000);
              const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              acc[user.id] = {
                username,
                fname,
                lname,
                joinDate: formattedDate,
              };
              return acc;
            }, {})
          : state.users; // keep existing if missing/empty

      const products =
        payloadProducts && payloadProducts.length > 0
          ? payloadProducts.reduce((acc, product) => {
              const { title, price, link, category, description, createDate } =
                product;
              acc[product.id] = {
                title,
                price,
                link,
                category,
                description,
                createDate,
              };
              return acc;
            }, {})
          : state.products;

      const categories =
        payloadCategories && payloadCategories.length > 0
          ? payloadCategories.reduce((acc, category) => {
              const { name } = category;
              acc[category.id] = { name };
              return acc;
            }, {})
          : state.categories;

      const orders =
        payloadOrders && payloadOrders.length > 0
          ? payloadOrders
          : state.orders;

      return { ...state, users, products, categories, orders };
    }
    default:
      return state;
  }
};

export default dataReducer;

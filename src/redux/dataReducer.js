// TODO - move users to admin reducer
const initialState = {
  users: {}, //details + join date per user ID
  orders: [],
  categories: {}, // names
  products: {}, // title, category, description, price link to pic per ID
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
              const { username, fname, lname, joined: joinDate } = user;
              acc[user.id] = { username, fname, lname, joinDate };
              return acc;
            }, {})
          : state.users; // keep existing if missing/empty

      const products =
        payloadProducts && payloadProducts.length > 0
          ? payloadProducts.reduce((acc, product) => {
              const { title, price, link, category } = product;
              acc[product.id] = { title, price, link, category };
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
    case "ADD_PRODUCT":
      return state;
    case "DELETE_PRODUCT":
      return state;
    case "ADD_CATEGORY":
      return state;
    case "DELETE_CATEGORY":
      return state;
    default:
      return state;
  }
};

export default dataReducer;

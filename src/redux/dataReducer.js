const initialState = {
  users: {}, // { [userId]: { username, fname, lname, joinDate, orders } }
  orders: [], // flattened array of all orders, sorted by date
  categories: {}, // { [categoryId]: { name } }
  products: {}, // { [productId]: { title, price, link, category, description, createDate } }
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD": {
      const {
        users: payloadUsers,
        products: payloadProducts,
        categories: payloadCategories,
      } = action.payload;

      const users =
        payloadUsers && payloadUsers.length > 0
          ? payloadUsers.reduce((acc, user) => {
              const { id, username, fname, lname, joined, orders } = user;
              const date = joined?.seconds
                ? new Date(joined.seconds * 1000)
                : joined;
              const formattedJoinDate = date
                ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                : null;

              acc[id] = {
                username,
                fname,
                lname,
                joinDate: formattedJoinDate,
                orders: orders || [],
              };
              return acc;
            }, {})
          : state.users;

      const orders = Object.entries(users)
        .flatMap(([userId, user]) => {
          return (user.orders || []).map((order) => {
            const date = new Date(order.date.seconds * 1000);
            return {
              ...order,
              userId,
              date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            };
          });
        })
        .sort((a, b) => {
          const aTime = a.date instanceof Date ? a.date.getTime() : 0;
          const bTime = b.date instanceof Date ? b.date.getTime() : 0;
          return aTime - bTime;
        });

      const products =
        payloadProducts && payloadProducts.length > 0
          ? payloadProducts.reduce((acc, product) => {
              const {
                id,
                title,
                price,
                link,
                category,
                description,
                createDate,
              } = product;
              acc[id] = {
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
              const { id, name } = category;
              acc[id] = { name };
              return acc;
            }, {})
          : state.categories;

      return { ...state, users, orders, products, categories };
    }

    default:
      return state;
  }
};

export default dataReducer;

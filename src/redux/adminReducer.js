const initialState = {
  orders: [], // flattened array of all orders, sorted by date
  users: {}, // { [userId]: { username, fname, lname, orders } }
  products: {},
  // This adds a layer of new products on top of firebase existing product. They
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_ADMIN_PRODUCTS": {
      const updatedProducts = { ...state.products };
      action.payload.forEach((product) => {
        updatedProducts[product.id] = { ...product };
      });
      return {
        ...state,
        products: updatedProducts,
      };
    }
    case "LOAD_USERS": {
      const { users: payloadUsers } = action.payload;
      const users =
        payloadUsers && payloadUsers.length > 0
          ? payloadUsers.reduce((acc, user) => {
              const { id, username, fname, lname, createDate, orders } = user;
              const date = createDate?.seconds
                ? new Date(createDate.seconds * 1000)
                : createDate;
              const formattedJoinDate = date
                ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                : null;

              acc[id] = {
                username,
                fname,
                lname,
                joinDate: formattedJoinDate,
                joinTimestamp: date ? date.getTime() : null,
                orders: orders || [],
              };
              return acc;
            }, {})
          : {};
      const orders = Object.entries(users)
        .flatMap(([userId, user]) => {
          return (user.orders || []).map((order) => {
            const date = new Date(order.date.seconds * 1000);
            return {
              ...order,
              userId,
              date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
              timestamp: date ? date.getTime() : null,
            };
          });
        })
        .sort((a, b) => {
          const aTime = a.date instanceof Date ? a.date.getTime() : 0;
          const bTime = b.date instanceof Date ? b.date.getTime() : 0;
          return aTime - bTime;
        });
      return { ...state, users, orders };
    }
    case "ADD_PRODUCT": {
      const updatedProducts = {
        ...state.products,
        [action.payload]: { id: action.payload },
      };
      return {
        ...state,
        products: updatedProducts,
      };
    }
    default:
      return state;
  }
};

export default adminReducer;

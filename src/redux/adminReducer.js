const initialState = {
  orders: [], // flattened array of all orders, sorted by date
  users: {}, // { [userId]: { username, fname, lname, orders } }
  products: {},
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_ADMIN_PRODUCTS": {
      const updatedProducts = { ...state.products };
      action.payload.forEach((product) => {
        updatedProducts[product.title] = { ...product };
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
              const {
                _id,
                id: firebaseId,
                username,
                fname,
                lname,
                createDate,
              } = user;
              const id = _id ?? firebaseId;
              const date = createDate?.seconds
                ? new Date(createDate.seconds * 1000)
                : createDate
                  ? new Date(createDate)
                  : null;
              const formattedJoinDate = date
                ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                : null;

              acc[id] = {
                username,
                fname,
                lname,
                joinDate: formattedJoinDate,
                joinTimestamp: date ? date.getTime() : null,
              };
              return acc;
            }, {})
          : {};
      return { ...state, users };
    }
    case "LOAD_ORDERS": {
      const parseDate = (raw) => {
        if (!raw) return null;
        if (raw?.toDate) return raw.toDate();
        if (raw?.seconds) return new Date(raw.seconds * 1000);
        return new Date(raw);
      };
      const orders = (action.payload ?? [])
        .map((order) => {
          const d = parseDate(order.date);
          const formatted =
            d && !isNaN(d)
              ? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
              : "-";
          return {
            ...order,
            date: formatted,
            timestamp: d && !isNaN(d) ? d.getTime() : 0,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp);
      return { ...state, orders };
    }
    case "ADD_PRODUCT": {
      const product = action.payload;
      return {
        ...state,
        products: { ...state.products, [product.title]: product },
      };
    }
    case "UPSERT_PRODUCT": {
      const { oldTitle, product } = action.payload;
      const products = Object.fromEntries(
        Object.entries(state.products).map(([key, val]) =>
          key === oldTitle ? [product.title, product] : [key, val],
        ),
      );
      return { ...state, products };
    }
    default:
      return state;
  }
};

export default adminReducer;

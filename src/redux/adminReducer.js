let draftCounter = 0;

const initialState = {
  orders: [],
  users: {},
  drafts: {}, // { [localId]: { localId, createdAt } }
  boughtByMap: {}, // { [productId]: [[name, qty, date], ...] }
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DRAFT": {
      const localId = ++draftCounter;
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [localId]: { localId, createdAt: Date.now() },
        },
      };
    }
    case "SAVE_DRAFT": {
      const { localId } = action.payload;
      const { [localId]: _, ...drafts } = state.drafts;
      return { ...state, drafts };
    }
    case "UPDATE_BOUGHT_BY": {
      const { id, entries } = action.payload;
      return {
        ...state,
        boughtByMap: { ...state.boughtByMap, [id]: entries },
      };
    }
    case "UPDATE_DRAFT": {
      const { localId, fields } = action.payload;
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [localId]: { ...state.drafts[localId], ...fields },
        },
      };
    }
    case "DELETE_DRAFT": {
      const { localId } = action.payload;
      const { [localId]: _, ...drafts } = state.drafts;
      return { ...state, drafts };
    }
    case "LOAD_USERS": {
      const { users: payloadUsers } = action.payload;
      const users =
        payloadUsers && payloadUsers.length > 0
          ? payloadUsers.reduce((acc, user) => {
              const { username, fname, lname, createDate } = user;
              const date = createDate?.seconds
                ? new Date(createDate.seconds * 1000)
                : createDate
                  ? new Date(createDate)
                  : null;
              const formattedJoinDate = date
                ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                : null;

              acc[username] = {
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
            username: order.username ?? order.user?.username,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp);
      return { ...state, orders };
    }
    default:
      return state;
  }
};

export default adminReducer;

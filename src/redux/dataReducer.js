// If there was a server side some of this info should be restricted to users (users/orders) and should be read only.
const initialState = {
    users: {}, //details + join date per user ID
    orders: [],
    categories: {}, // names
    products: {}, // title, category, description, price link to pic per ID
}

const dataReducer = (state=initialState, action) => {
    switch (action.type) {
        case "LOAD":
            const users = action.payload.users.reduce((acc, user) => {
                const { username, fname, lname, joined: joinDate } = user;
                acc[user.id] = { username, fname, lname, joinDate };
                return acc;
            }, {});
            console.log(action.payload);
            
            const products = action.payload.products.reduce((acc, product) => {
                const { title, price, link, category } = product;
                acc[product.id] = { title, price, link, category };
                return acc;
            }, {});

            const categories = action.payload.categories.reduce((acc, category) => {
                const { name } = category;
                acc[category.id] = { name };
                return acc;
            }, {});
            return {users, orders: action.payload.orders, categories, products}
        case "ADD_PRODUCT":
            return state
        case "DELETE_PRODUCT":
            return state
        case "ADD_CATEGORY":
            return state
        case "DELETE_CATEGORY":
            return state
        default:
            return state
    }
}

export default dataReducer;
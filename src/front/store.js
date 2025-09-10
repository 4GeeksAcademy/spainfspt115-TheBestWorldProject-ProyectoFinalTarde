export const initialStore = () => {
  return {
    user: null,
    token: null,
    isRegistered: false,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_registered":
      return {
        ...store,
        isRegistered: action.payload,
      };

    case "set_user":
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
        isRegistered: true,
      };

    case "logout":
      return {
        ...store,
        user: null,
        token: null,
        isRegistered: false,
      };

    default:
      throw Error("Unknown action");
  }
}

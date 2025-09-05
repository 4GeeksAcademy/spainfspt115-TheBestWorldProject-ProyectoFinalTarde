export const initialStore = () => {
  return {
    user: null,
    isRegistered: true,
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
        user: action.payload,
        isRegistered: true,
      };
    default:
      throw Error("Unknown action");
  }
}

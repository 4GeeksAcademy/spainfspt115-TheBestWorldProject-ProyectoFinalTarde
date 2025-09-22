export const initialStore = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return {
      user: null,
      token: token,
      isRegistered: true,
      mode: "light",
    };
  }
  return {
    user: null,
    token: null,
    isRegistered: false,
    mode: "light",
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

    case "update_user":
      return {
        ...store,
        user: action.payload.user,
      };

    case "logout":
      return {
        ...store,
        user: null,
        token: null,
        isRegistered: false,
      };

    case "SET_MODE":
      return {
        ...store,
        mode: action.payload,
      };

    default:
      throw new Error("Unknown action: " + action.type);
  }
}

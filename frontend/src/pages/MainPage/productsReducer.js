export const productActions = {
  SET: "SET",
  ADD: "ADD",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export function productsReducer(state, action) {
  switch (action.type) {
    case productActions.SET:
      return action.payload;

    case productActions.ADD:
      return [...state, action.payload];

    case productActions.UPDATE:
      return state.map((p) => (p.id === action.payload.id ? action.payload : p));

    case productActions.DELETE:
      return state.filter((p) => p.id !== action.payload);
      
    default:
      return state;
  }
}
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
      
    default:
      return state;
  }
}
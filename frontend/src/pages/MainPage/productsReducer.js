// productsReducer.js
// Ovaj fajl sadrži reducer funkciju za upravljanje listom proizvoda u React aplikaciji.
// Reducer se koristi sa useReducer hook-om i omogućava centralizovano upravljanje stanjima (dodavanje, izmena, brisanje, setovanje proizvoda).

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
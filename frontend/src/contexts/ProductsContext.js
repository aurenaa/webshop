import { createContext, useContext, useReducer } from 'react';
import { productsReducer, productActions } from '../pages/MainPage/productsReducer';

const ProductsContext = createContext();

export function useProducts() {
  return useContext(ProductsContext);
}

export function ProductsProvider({ children }) {
  const [products, dispatch] = useReducer(productsReducer, []);
  
  return (
    <ProductsContext.Provider value={{ products, dispatch }}>
      {children}
    </ProductsContext.Provider>
  );
}
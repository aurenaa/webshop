import { useEffect, useReducer, useState } from "react";
import { productActions, productsReducer } from "./productsReducer";
import axios from "axios";
import ProductTable from "./components/ProductTable";
import { useProductsList } from "../../hooks/useProductsList";
import "./MainPage.css";

export default function MainPage() {
  const [mode, setMode] = useState("BROWSE");
  const [products, dispatch] = useReducer(productsReducer, []);
  const productsList = useProductsList() || [];

  console.log("ProductsList from hook:", productsList); // Dodajte ovo

  useEffect(() => {
    console.log("Dispatching SET action with:", productsList);
    dispatch({type: productActions.SET, payload: productsList});
  }, [productsList]);

  console.log("Current products state:", products); // Dodajte ovo

  return (
    <div className="main-page">
      <div className="header">
        <h1 className="site-name">WebShop</h1>
        <button className="login-button">Login</button>
      </div>
      <div className="products-table">
        {products && products.length > 0 ? ( // Izmenjen uslov
          <ProductTable products={products} /> 
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
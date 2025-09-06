import { useEffect, useReducer, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { productActions, productsReducer } from "./productsReducer";
import axios from "axios";
import ProductTable from "./components/ProductTable";
import { useProductsList } from "../../hooks/useProductsList";
import "./MainPage.css";

export default function MainPage() {
  const [mode, setMode] = useState("BROWSE");
  const [products, dispatch] = useReducer(productsReducer, []);
  const productsList = useProductsList() || [];
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({type: productActions.SET, payload: productsList});
  }, [productsList]);

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div className="main-page">
      <div className="header">
        <h1 className="site-name">WebShop</h1>
        <button onClick={handleClick} className="login-button">Login</button>
      </div>
      <div className="products-table">
          <ProductTable products={products} /> 
      </div>
    </div>
  );
}
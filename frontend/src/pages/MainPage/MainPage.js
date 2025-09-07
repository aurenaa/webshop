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
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
      <span className="navbar-brand">WebShop</span>

      <div className="position-absolute start-50 translate-middle-x d-flex">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </div>
      
      <div className="d-flex align-items-center ms-auto">
        <button onClick={() => navigate("/add-product")} className="btn btn-success me-2">Add a Listing</button>
        <button onClick={() => navigate("/signup")} className="btn btn-outline-primary me-2">Sign Up</button>
        <span 
          onClick={() => navigate("/login")} 
          className="nav-link" 
          style={{ cursor: "pointer" }}
        >
          Log in
        </span>
      </div>
    </nav>

    <div className="products-table mt-3">
      <ProductTable products={products} />
    </div>
  </div>
  );
}
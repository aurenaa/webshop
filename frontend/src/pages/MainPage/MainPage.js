import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useProducts } from "../../contexts/ProductsContext";
import ProductTable from "./components/ProductTable";
import { useProductsList } from "../../hooks/useProductsList";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import "./MainPage.css";

export default function MainPage() {
  const { products, dispatch } = useProducts();
  const productsList = useProductsList() || [];
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthorize();
  useEffect(() => {
    dispatch({ type: "SET", payload: productsList });
  }, [productsList]);

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
        {isLoggedIn ? (
          <>
            <img 
              src="/icons/shopping_cart.png" 
              alt="Cart" 
              style={{ width: "30px", height: "30px", marginRight: "15px", cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            />
            <img 
              src="/icons/account_circle.png" 
              alt="User" 
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            />
          </>
        ) : (
          <>
            <button onClick={() => navigate("/signup")} className="btn btn-outline-primary me-2">
              Sign Up
            </button>
            <span 
              onClick={() => navigate("/login")}
              className="nav-link" 
              style={{ cursor: "pointer" }}
            >
              Log in
            </span>
          </>
        )}
        {isLoggedIn && ( <span onClick={() => { logout(); navigate("/");}} className="nav-link ms-3" style={{ cursor: "pointer" }}>
            Log out
          </span>
        )}
      </div>
      </nav>
      <div className="products-table mt-3">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useProducts } from "../../contexts/ProductsContext";
import { useUser } from "../../contexts/UserContext";
import ProductTable from "./components/ProductTable";
import { useProductsList } from "../../hooks/useProductsList";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./MainPage.css";

export default function MainPage() {
  const { products, dispatch } = useProducts();
  const productsList = useProductsList() || [];
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuthorize();
  const { user } = useUser();
  
  useEffect(() => {
    dispatch({ type: "SET", payload: productsList });
  }, [productsList]);

  const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/mainpage');
  };

  return (
    <div className="main-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
        <span className="navbar-brand">WebShop</span>

        <div className="position-absolute start-50 translate-middle-x d-flex">
          <input className="form-control me-2"
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
            <img className="cart" src="/icons/shopping_cart.png" alt="Cart" onClick={() => navigate("/cart")}/>
            <div className="dropdown">
                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <img className="menu" src="/icons/menu.png" alt="Menu"/>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <a className="dropdown-item" onClick={() => navigate(`/profile/${user?.id}`)}>
                      Account settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={() => navigate(`/user/${user?.id}`)}>
                      My profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Log out
                    </a>
                  </li>
                </ul>
              </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/signup")} className="btn btn-outline-primary me-2">
              Sign Up
            </button>
            <span onClick={() => navigate("/login")} className="nav-link" style={{ cursor: "pointer" }}>
              Log in
            </span>
          </>
        )}
      </div>
      </nav>
      <div className="products-table mt-3">
        <ProductTable products={products.filter(p => (p.status != "PROCESSING") && (p.status != "SOLD") )} />
      </div>
    </div>
  );
}
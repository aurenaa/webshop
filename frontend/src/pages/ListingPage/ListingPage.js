import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useProducts } from "../../contexts/ProductsContext";
import { useProductsList } from "../../hooks/useProductsList";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUser } from "../../contexts/UserContext";
import ProductTable from "../MainPage/components/ProductTable";
import "./ListingPage.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function ListingPage() {
  const { products, dispatch } = useProducts();
  const { user } = useUser();
  const productsList = useProductsList() || [];
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, logout } = useAuthorize();

  useEffect(() => {
    dispatch({ type: "SET", payload: productsList });
  }, [productsList]);

  const userProducts = isLoggedIn ? products.filter(p => p.sellerId === user.id) : [];
   
    return (
       <div className="main-page">
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
                <span onClick={() => navigate("/signup")} className="navbar-brand">WebShop</span>

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
                        <li><a className="dropdown-item" onClick={() => navigate("/profile")}>My account</a></li>
                        <li><a className="dropdown-item" href="#">My listings</a></li>
                        <li><a className="dropdown-item" href="#">Log out</a></li>
                        </ul>
                    </div>
                </>
                ) : (
                <>
                    <button onClick={() => navigate("/signup")} className="btn btn-outline-primary me-2">Sign Up</button>
                    <span onClick={() => navigate("/login")} className="nav-link" style={{ cursor: "pointer" }}>Log in</span>
                </>
                )}
            </div>
        </nav>
        <div className="text-bg-light p-3 custom-box">       
            <div className="container text-center">
                {userProducts.length > 0 ? (
                <>
                    {Array.from({ length: Math.ceil(products.length / 3) }).map((_, rowIndex) => (
                        <div className="row row-cols-auto mb-3" key={rowIndex}>
                            {userProducts.slice(rowIndex * 3, rowIndex * 3 + 3).map((product, colIndex) => (
                                <div className="col" key={colIndex}>
                                    <ProductTable products={[product]}/> 
                                </div>
                            ))}
                        </div>
                    ))}            
                </>
                ) : (
                <>
                    <h2>You have no active listings</h2>
                    <p>Click on the "Add listings" button to start selling.</p>
                    <button onClick={() => navigate("/add-product")} className="btn btn-success me-2">Add a Listing</button>
                </> 
                )}
            </div>
        </div>
    </div>
    );
}
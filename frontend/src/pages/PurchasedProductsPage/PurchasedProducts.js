import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useProducts } from "../../contexts/ProductsContext";
import { useProductsList } from "../../hooks/useProductsList";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUser } from "../../contexts/UserContext";
import "./PurchasedProducts.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function PurchasePage() {
  const { products, dispatch } = useProducts();
  const { user } = useUser();
  const productsList = useProductsList() || [];
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuthorize();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/mainpage');
  };

  useEffect(() => {
    dispatch({ type: "SET", payload: productsList });
  }, [productsList, dispatch]);

  const purchasedProducts = isLoggedIn ? products.filter(p => p.buyerId === user.id) : [];

  return (
    <div className="main-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
        <span onClick={() => navigate("/mainpage")} className="navbar-brand">WebShop</span>

        <div className="position-absolute start-50 translate-middle-x d-flex">
          <input className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </div>

        <div className="d-flex align-items-center ms-auto">
          {isLoggedIn ? (
            <>
              <img className="cart" src="/icons/shopping_cart.png" alt="Cart" onClick={() => navigate("/cart")} />
              <div className="dropdown">
                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <img className="menu" src="/icons/menu.png" alt="Menu" />
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li><a className="dropdown-item" onClick={() => navigate("/profile")}>My account</a></li>
                  <li><a className="dropdown-item" onClick={() => navigate("/purchasedpage")}>My purchases</a></li>
                  <li><a className="dropdown-item" onClick={handleLogout}>Log out</a></li>
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
          {purchasedProducts.length > 0 ? (
            <>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>More info</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.status}</td>
                      <td>
                        {product.status === "REJECTED" && product.rejectionReason && (
                          <div className="text-danger"><small> {product.rejectionReason}</small></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2>You have no purchases</h2>
              <p>Browse products and buy something to see it here.</p>
              <button onClick={() => navigate("/mainpage")} className="btn btn-success me-2">Go to shop</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
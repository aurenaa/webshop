import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from "../../contexts/ProductsContext";
import { useProductsList } from "../../hooks/useProductsList";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUser } from "../../contexts/UserContext";
import "./PurchasedProducts.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function PurchasePage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();
  const productsList = useProductsList() || [];
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuthorize();
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    const fetchProductAndPurchase = async () => {
      try {
        const productRes = await axios.get(`http://localhost:8080/WebShopAppREST/rest/mainpage/${id}`);
        setProduct(productRes.data);

        const purchaseRes = await axios.get(`http://localhost:8080/WebShopAppREST/rest/purchases/product/${id}`);
        setPurchase(purchaseRes.data);
      } catch (err) {
        console.error(err);
        alert("Product or purchase not found");
      }
    };
    fetchProductAndPurchase();
  }, [id, navigate]);


  if (!product) {
    return <div className="text-center mt-5">Loading product...</div>;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/mainpage');
  };

  const handleCancel = async () => {
    try {
      await axios.patch(`http://localhost:8080/WebShopAppREST/rest/purchases/${purchase.id}/cancel`);

      alert("Purchase canceled successfully!");
      navigate("/mainpage");
    } catch (err) {
      alert(err.response?.data || "Error canceling purchase.");
    }
  };

  return (
    <div className="main-page">
                  <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
                <span onClick={() => navigate("/mainpage")} className="navbar-brand">WebShop</span>

                <div className="position-absolute start-50 translate-middle-x d-flex">
                    <input className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        style={{ width: "400px" }}                        
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

      <div className="container mt-5 text-center">
        <h2>{product.name}</h2>
        <img 
          src={product.productPictures && product.productPictures.length > 0 
               ? `http://localhost:8080/WebShopAppREST/images/products/${product.productPictures[0]}`
               : "/icons/no_image.jpg"} 
          alt={product.name} 
          className="img-fluid mb-3" 
          style={{ maxHeight: "300px" }}
          onError={(e) => e.target.src = "/icons/no_image.jpg"}
        />
        <p>Price: {product.price} RSD</p>
        <p>Status: {product.status}</p>
        {product.status === "REJECTED" && product.rejectionReason && (
          <p className="text-danger">Reason: {product.rejectionReason}</p>
        )}

        {product.status === "PROCESSING" && (
          <button className="btn btn-danger mt-3" onClick={() => setShowModal(true)}>
            Cancel Purchase
          </button>
        )}

        <div className="mt-3">
          <button className="btn btn-success" onClick={() => navigate("/mainpage")}>
            Go to Shop
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Cancel</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this purchase?</p>
                <p className="text-danger"><small>This action cannot be undone!</small></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>No</button>
                <button className="btn btn-danger" onClick={handleCancel}>Yes, Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
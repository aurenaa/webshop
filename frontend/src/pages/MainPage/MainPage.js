import { useEffect } from "react";
import { useState } from "react";
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
  
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [productType, setProductType] = useState("");
  const [locationId, setLocationId] = useState("");
  
  useEffect(() => {
    dispatch({ type: "SET", payload: productsList });
  }, [productsList]);

  const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/mainpage');
  };

  const handleSearch = async () => { 
    try {
      const params = new URLSearchParams();

      if (query) params.append("query", query);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (categoryName) params.append("categoryName", categoryName);
      if (productType) params.append("productType", productType);
      if (locationId) params.append("locationId", locationId);

      const url = `http://localhost:8080/WebShopAppREST/rest/mainpage/search?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      dispatch({ type: "SET", payload: data });
    } catch (err) {
      console.error("Search failed:", err);
    }
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
                 value = {query}
                 onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit" onClick={handleSearch}>Search</button>
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
      
      <div className="container-xxl mt-3">
        <div className="row g-1">
          <aside className="col-12 col-lg-2">
            <div className="filter-sidebar">
              <h6 className="filters-title text-center mb-2">Filters</h6>

              <div className="accordion accordion-flush" id="filtersAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingCategory">
                    <button className="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#collapseCategory">
                      Category
                    </button>
                  </h2>
                  <div id="collapseCategory" className="accordion-collapse collapse" data-bs-parent="#filtersAccordion">
                    <div className="accordion-body">
                      <input type="text" className="form-control" placeholder="category"
                            value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingPrice">
                    <button className="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#collapsePrice">
                      Price
                    </button>
                  </h2>
                  <div id="collapsePrice" className="accordion-collapse collapse" data-bs-parent="#filtersAccordion">
                    <div className="accordion-body d-flex gap-2">
                      <input type="number" className="form-control" placeholder="Min"
                            value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                      <input type="number" className="form-control" placeholder="Max"
                            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingType">
                    <button className="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#collapseType">
                      Sale type
                    </button>
                  </h2>
                  <div id="collapseType" className="accordion-collapse collapse" data-bs-parent="#filtersAccordion">
                    <div className="accordion-body">
                      <select className="form-select" value={productType}
                              onChange={(e) => setProductType(e.target.value)}>
                        <option value="">All</option>
                        <option value="FIXED_PRICE">Fixed price</option>
                        <option value="AUCTION">Auction</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingLocation">
                    <button className="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#collapseLocation">
                      Location
                    </button>
                  </h2>
                  <div id="collapseLocation" className="accordion-collapse collapse" data-bs-parent="#filtersAccordion">
                    <div className="accordion-body">
                      <input type="text" className="form-control" placeholder="location"
                            value={locationId} onChange={(e) => setLocationId(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-success me-2 mt-4" onClick={handleSearch}>
                Filter products
              </button>
              <button
                className="btn btn-outline-success me-2 mt-4"
                onClick={() => {
                  setQuery(""); setMinPrice(""); setMaxPrice("");
                  setCategoryName(""); setProductType(""); setLocationId("");
                  dispatch({ type: "SET", payload: productsList });
                }}
              >
                Reset
              </button>
            </div>
          </aside>

        <main className="col-12 col-lg-10">
          <div className="products-container">
            <ProductTable
              products={products.filter(p => p.status !== "PROCESSING" && p.status !== "SOLD")}
            />
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
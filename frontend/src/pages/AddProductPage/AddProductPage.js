import { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useProducts } from "../../contexts/ProductsContext";
import axios from "axios";
import { productsReducer, productActions } from "../MainPage/productsReducer";
import "./AddProductPage.css";

export default function AddProductPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthorize();

    const { dispatch } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        saleType: "FIXED_PRICE"
    });
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
        const response = await axios.post(
            "http://localhost:8081/WebShopAppREST/rest/mainpage/", 
            selectedProduct
    );

    dispatch({ type: "ADD", payload: response.data });

      setMessage("Listing added.");
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setMessage("Error while posting listing.");
    }
    };

    return (
        <div className="add-product-page">

        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <span className="navbar-brand" onClick={() => navigate("/")}>WebShop</span>
            <div className="d-flex align-items-center ms-auto">
            <button onClick={() => navigate("/add-product")} className="btn btn-success me-2">Add a Listing</button>
            <button onClick={() => navigate("/signup")} className="btn btn-outline-primary me-2">Sign Up</button>
            <span onClick={() => navigate("/login")} className="nav-link" style={{ cursor: "pointer" }}>Log in</span>
            </div>
        </nav>

        <div className="container mt-4">
            <h2>Add a New Product</h2>
            <p>Fill in the details below to post your product for sale.</p>
            <div className="form-border p-4">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                required
                />
                <input
                type="number"
                name="price"
                placeholder="Price"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                required
                />
                <input
                type="text"
                name="category"
                placeholder="Category"
                value={selectedProduct.category}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                />
                <textarea
                name="description"
                placeholder="Description"
                value={selectedProduct.description}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                />
                <select
                name="saleType"
                value={selectedProduct.saleType}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, saleType: e.target.value })}
                >
                <option value="FIXED_PRICE">Fixed Price</option>
                <option value="AUCTION">Auction</option>
                </select>
                <button className="btn btn-secondary mt-2" type="submit">Add Product</button>
            </form>
            </div>
            {message && <p className="mt-2">{message}</p>}
        </div>
    </div>
    );
}
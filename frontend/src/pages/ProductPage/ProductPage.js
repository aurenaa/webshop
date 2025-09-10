import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";

export default function ProductPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    const handleHomeClick = () => {
        navigate('/mainPage');
    };

    const handleDeleteClick = async () =>
    {
        try
        {
            await axios.delete(`http://localhost:8080/WebShopAppREST/rest/mainpage/${id}`);
            navigate('/mainPage');
        }
        catch (err)
        {
            console.error("Error deleting product", err);
        }
    };

    const { id } = useParams();     
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const response = await axios.get(
            `http://localhost:8080/WebShopAppREST/rest/mainpage/${id}`
            );
            setProduct(response.data);
        } catch (err) {
            console.error("Error fetching product", err);
        }
    };

    fetchProduct();
  }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
    <div className="main-page">
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
            <span
                onClick={handleHomeClick}
                className="navbar-brand"
                style={{ cursor: "pointer" }}
            >WebShop</span>

            <div className="position-absolute start-50 translate-middle-x d-flex">
                <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </div>

            <button onClick={handleClick} className="btn btn-primary ms-auto">Login</button>
        </nav>

        <div className="body">
            <div className="image-gallery"></div>
            <div className="image"></div>
            <div className="product-info">
                <h2>{product.name}</h2>
                <p><strong>Price:</strong> {product.price} RSD</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p>{product.description}</p>
                <p><strong>Date posted:</strong> {new Date(product.datePosted).toLocaleDateString()}</p>
                <p><strong>Sale type:</strong> {product.saleType === "FIXED_PRICE" ? "Fixed price" : "Auction"}</p>
                <div className="buttons">
                    <button className="btn btn-primary me-2">Edit</button>
                    <button onClick={handleDeleteClick} className="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    </div>
    );
}
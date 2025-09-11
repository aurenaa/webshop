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

    const handleEditClick = () =>
    {
        setEditedProduct({...product});
        setIsEditing(true);
    }

    const { id } = useParams();     
    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async () => {
        try {
            console.log("PATCH payload:", editedProduct);
            const response = await axios.patch(
            `http://localhost:8080/WebShopAppREST/rest/mainpage/${id}`,
            editedProduct,
            { headers: { "Content-Type": "application/json" } }
            );
            console.log("Response:", response.data);
            setProduct(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating product", err);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedProduct(null);
    };

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
                

                {isEditing ? (
                        <>
                            <p><strong>Name:</strong>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedProduct.name}
                                    onChange={handleChange}
                                />
                            </p>
                            <p><strong>Price:</strong> 
                                <input
                                    type="number"
                                    name="price"
                                    value={editedProduct.price}
                                    onChange={handleChange}
                                /> RSD
                            </p>
                            <p><strong>Category:</strong> 
                                <input
                                    type="text"
                                    name="category"
                                    value={editedProduct.category}
                                    onChange={handleChange}
                                />
                            </p>
                            <textarea
                                name="description"
                                value={editedProduct.description}
                                onChange={handleChange}
                            />
                            <p><strong>Date posted:</strong> {new Date(product.datePosted).toLocaleDateString()}</p>
                            <p><strong>Sale type:</strong> 
                                <select
                                    name="saleType"
                                    value={editedProduct.saleType}
                                    onChange={handleChange}
                                >
                                    <option value="FIXED_PRICE">Fixed price</option>
                                    <option value="AUCTION">Auction</option>
                                </select>
                            </p>
                            <div className="buttons">
                                <button onClick={handleSaveClick} className="btn btn-success me-2">Save</button>
                                <button onClick={handleCancelClick} className="btn btn-secondary">Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>{product.name}</h2>
                            <p><strong>Price:</strong> {product.price} RSD</p>
                            <p><strong>Category:</strong> {product.category}</p>
                            <p>{product.description}</p>
                            <p><strong>Date posted:</strong> {new Date(product.datePosted).toLocaleDateString()}</p>
                            <p><strong>Sale type:</strong> {product.saleType === "FIXED_PRICE" ? "Fixed price" : "Auction"}</p>
                            <div className="buttons">
                                <button onClick={handleEditClick} className="btn btn-primary me-2">Edit</button>
                                <button onClick={handleDeleteClick} className="btn btn-danger">Delete</button>
                            </div>
                        </>
                    )}
            </div>
        </div>
    </div>
    );
}
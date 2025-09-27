import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import "./ProductPage.css";

export default function ProductPage() {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuthorize();
    const { user } = useUser();

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

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/mainpage');
    };


    const handleAuctionClick = () => {
        if (product.saleType == "FIXED_PRICE") {
            console.log("Not available");
            return;
        }

        if (!product.bids || product.bids.length === 0) {
        alert("No bids to finalize auction.");
        return;
        }

        const offers = product.bids.map(b => b.offer);
        const maxOffer = Math.max(...offers);
        const auctionWinner = product.bids.find(b => b.offer == maxOffer);

        const endAuction = async () => {
            try
            {
                await axios.patch(
                `http://localhost:8080/WebShopAppREST/rest/users/${product.id}/endAuction`,
                {
                    sellerId: product.sellerId,
                    buyerId: auctionWinner.buyerId
                }
            );
                navigate('/mainPage');
            }
            catch (err)
            {
                console.error("Error ending auction", err);
            }
        }
        endAuction();
    };

    const [seller, setSeller] = useState(null);

    useEffect(() => {
    if (product?.sellerId) {
        axios.get(`http://localhost:8080/WebShopAppREST/rest/users/${product.sellerId}`)
        .then(res => setSeller(res.data))
        .catch(err => console.error("Error fetching seller", err));
    }
    }, [product]);

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
                        <li><a className="dropdown-item" onClick={() => navigate("/listingpage")}>My listings</a></li>
                        <li><a className="dropdown-item" onClick={() => handleLogout}>Log out</a></li>
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
        <div className="body">
            <div className="image-gallery"></div>
            <div className="image"></div>
            <div className="product-info">            
                {isEditing ? (
                        <>
                            <p> 
                                <strong>Name:</strong>
                                <input type="text" name="name" value={editedProduct.name}onChange={handleChange}/>
                            </p>
                            <p>
                                <strong>Price:</strong> 
                                <input type="number" name="price" value={editedProduct.price} onChange={handleChange}/> RSD
                            </p>
                            <p>
                                <strong>Category:</strong> 
                                <input type="text" name="category" value={editedProduct.category} onChange={handleChange}/>
                            </p>
                            <textarea name="description" value={editedProduct.description} onChange={handleChange}/>
                            <p><strong>Date posted:</strong> {new Date(product.datePosted).toLocaleDateString()}</p>
                            <p><strong>Sale type:</strong> 
                                <select name="saleType" value={editedProduct.saleType} onChange={handleChange}>
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
                            <div className="seperator"></div>
                            <div className="user">
                                <img className="user-img"
                                     src={seller?.profilePicture ? `http://localhost:8080/WebShopAppREST/images/profiles/${seller.profilePicture}` : "/icons/account_circle.png"}
                                />
                                <div
                                    onClick={() =>
                                    user?.id === product.sellerId
                                        ? navigate("/profile")
                                        : navigate(`/user/${product.sellerId}`)
                                    }
                                    className="username"
                                >
                                    <strong>{user?.id === product.sellerId ? user.username : seller?.username || "Unknown user"}</strong>
                                </div>
                            </div>
                            <div className="seperator"></div>
                            <p><strong>{product.price} RSD</strong></p>
                            <p><strong>Category:</strong> {product.category}</p>
                            <p><strong>Description:</strong></p>
                            <p>{product.description}</p>
                            <p><strong>Date posted:</strong> {new Date(product.datePosted).toLocaleDateString()}</p>
                            <p><strong>Sale type:</strong> {product.saleType === "FIXED_PRICE" ? "Fixed price" : "Auction"}</p>
                            <div className="buttons">
                                {isLoggedIn && (user.id == product.sellerId) ? (
                                        <>  
                                            { product.saleType === "AUCTION" && product.bids.length == 0 && (
                                                <button onClick={handleEditClick} className="btn btn-primary me-2">Edit</button>
                                            )}
                                            { product.saleType === "FIXED_PRICE" && (
                                                <button onClick={handleEditClick} className="btn btn-primary me-2">Edit</button>
                                            )}                                            
                                            <button onClick={handleDeleteClick} className="btn btn-danger">Delete</button>
                                            {product.saleType === "AUCTION" && (
                                                <button onClick={handleAuctionClick} className="btn btn-primary">End auction</button>
                                            )}
                                        </>
                                ) : (
                                    <>
                                        {product.saleType === "AUCTION" ? (
                                            <button onClick={() => isLoggedIn ? navigate("/offer") : navigate("/login")} className="btn btn-primary">Make offer</button>
                                        ) : (
                                            <button onClick={() => isLoggedIn ? navigate("/offer") : navigate("/login")} className="btn btn-primary">Buy it now</button>                                            
                                        )}    
                                        <button onClick={() => isLoggedIn ? navigate("/offer") : navigate("/login")} className="btn btn-primary">Add to cart</button>
                                        <button onClick={() => isLoggedIn ? navigate("/offer") : navigate("/login")} className="btn btn-danger">Add to wishlist</button>                               
                                    </>
                                )}
                            </div>
                        </>
                    )}
            </div>
        </div>
    </div>
    );
}
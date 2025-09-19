import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useProducts } from "../../contexts/ProductsContext";
import ProductTable from "../MainPage/components/ProductTable";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./UserProfilePage.css";

export default function UserProfilePage() {
    const { user, userLoggedIn } = useUser();
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuthorize();
    const [userProfile, setUserProfile] = useState(null);
    const { id } = useParams();
    const [product] = useState(null);
    const { products } = useProducts();
    const [activeTab, setActiveTab] = useState("items");

    useEffect(() => {
        if (isLoggedIn && Number(id) === userLoggedIn.id) {
            setUserProfile(userLoggedIn);
            } else {
            axios.get(`http://localhost:8080/WebShopAppREST/rest/users/${id}`)
                .then(res => setUserProfile(res.data))
                .catch(err => console.error("Error fetching user", err));
            }
    }, [id, isLoggedIn, userLoggedIn]);

    const userProducts = useMemo(() => {
        if (!userProfile) return [];
        if (!userProfile.productList) return [];

        const productIds = typeof userProfile.productList === "string"
            ? userProfile.productList.split("|").map(id => Number(id))
            : userProfile.productList;

        return products.filter(p => productIds.includes(p.id));
    }, [userProfile, products]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/mainpage');
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
                            <li><a className="dropdown-item" onClick={() => navigate(`/profile/${user.id}`)}>My account</a></li>
                            <li><a className="dropdown-item" onClick={() => navigate("/listingpage")}>My listings</a></li>
                            <li><a className="dropdown-item" onClick={handleLogout}>Log out</a></li>
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
            
            {userProfile && (
                <>
                    {userProfile.role === "SELLER" && (
                        <div className="background">
                            <div className="header">
                                <img className="user-img"
                                     src={userProfile?.profileImage ? `http://localhost:8080/WebShopAppREST/images/profiles/${userProfile.profileImage}` : "/icons/account_circle.png"}
                                />
                                <div className="username">
                                    {userProfile.username}
                                </div>
                                <div className="rating">
                                    <div>Average rating:</div>
                                    <div>4.7</div>
                                </div>
                            </div>
                            <div className="profile-details">
                                <div className={`profile-click ${activeTab === "items" ? "active" : ""}`} onClick={() => setActiveTab("items")}>
                                    Items ({userProfile?.productList?.length || 0})
                                </div>
                                <div className={`profile-click ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>
                                    About
                                </div>
                                <div className={`profile-click ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
                                    Feedback
                                </div>                  

                                <nav className="navbar bg-body">
                                    <div className="container-fluid">
                                        <form className="d-flex" role="search">
                                            <input className="form-control me-2 search" type="search" placeholder={`Search all ${userProfile?.productList?.length || 0} items`} aria-label="Search"/>
                                            <button className="btn" type="submit">
                                                <img className="search-img" src="/icons/search.png"/>
                                            </button>
                                        </form>
                                    </div>
                                </nav>
                            </div>
                            <div className="profile-content mt-3 tabel">
                                {activeTab === "items" && (
                                <div>
                                    {userProducts.length > 0 ? (
                                        Array.from({ length: Math.ceil(userProducts.length / 3) }).map((_, rowIndex) => (
                                            <div className="row row-cols-auto mb-3" key={rowIndex}>
                                                {userProducts.slice(rowIndex * 3, rowIndex * 3 + 3).map((product) => (
                                                    <div className="col" key={product.id}>
                                                    <ProductTable products={[product]} />
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                            ) : (
                                            <p>No items to display.</p>
                                    )}
                                </div>
                                )}

                            {activeTab === "about" && (
                                <div className="about-section">
                                    <p className="section">Description:</p>
                                    <p>{userProfile?.description || "No information provided."}</p>
                                    <p className="section">Email:</p>
                                    <p>{userProfile?.email || "No information provided."}</p>
                                </div>
                            )}

                            {activeTab === "feedback" && (
                                <div>
                                {userProfile?.feedback?.map(f => (
                                    <div key={f.id}>{f.comment}</div>
                                ))}
                                </div>
                            )}
                            </div>
                        </div>
                    )}

                    {userProfile.role === "BUYER" && (
                        <div className="background">
                            <div className="header">
                                <img className="user-img"
                                     src={userProfile?.profileImage ? `http://localhost:8080/WebShopAppREST/images/profiles/${userProfile.profileImage}` : "/icons/account_circle.png"}
                                />
                                <div className="username">
                                    {userProfile.username}
                                </div>
                                <div className="rating">
                                    <div>Average rating:</div>
                                    <div>4.7</div>
                                </div>
                            </div>
                            <div className="profile-details">
                                <div className={`profile-click ${activeTab === "items" ? "active" : ""}`} onClick={() => setActiveTab("items")}>
                                    Purchases ({userProfile?.productList?.length || 0})
                                </div>
                                <div className={`profile-click ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>
                                    About
                                </div>
                                <div className={`profile-click ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
                                    Feedback
                                </div>                  
                            </div>
                            <div className="profile-content mt-3 tabel">
                                {activeTab === "items" && (
                                <div>
                                    {userProducts.length > 0 ? (
                                        Array.from({ length: Math.ceil(userProducts.length / 3) }).map((_, rowIndex) => (
                                            <div className="row row-cols-auto mb-3" key={rowIndex}>
                                                {userProducts.slice(rowIndex * 3, rowIndex * 3 + 3).map((product) => (
                                                    <div className="col" key={product.id}>
                                                    <ProductTable products={[product]} />
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                            ) : (
                                            <p>No items to display.</p>
                                    )}
                                </div>
                                )}

                            {activeTab === "about" && (
                                <div className="about-section">
                                    <p className="section">Description:</p>
                                    <p>{userProfile?.description || "No information provided."}</p>
                                    <p className="section">Email:</p>
                                    <p>{userProfile?.email || "No information provided."}</p>
                                </div>
                            )}

                            {activeTab === "feedback" && (
                                <div>
                                {userProfile?.feedback?.map(f => (
                                    <div key={f.id}>{f.comment}</div>
                                ))}
                                </div>
                            )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
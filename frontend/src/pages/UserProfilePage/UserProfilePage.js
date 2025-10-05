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
    const { user } = useUser();
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuthorize();
    const [userProfile, setUserProfile] = useState(null);
    const { id } = useParams();
    const { products } = useProducts();
    const [activeTab, setActiveTab] = useState("items");
    const [otherReason, setOtherReason] = useState("");

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showOthers, setShowOthers] = useState(false);
    const [reviewScore, setReviewScore] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewTargetUser, setReviewTargetUser] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');

    const openReviewModal = (userToReview) => {
        setReviewTargetUser(userToReview);
        setReviewScore(5);   
        setReviewComment("");     
        setShowReviewModal(true);  
    };

    const openReportModal = (userToReview) => {
        setReviewTargetUser(userToReview);   
        setShowReportModal(true);     
    }

    useEffect(() => {
            if (isLoggedIn && user && Number(id) === user.id) {
                setUserProfile(user);
            } else {
                axios.get(`http://localhost:8080/WebShopAppREST/rest/users/${id}/withFeedback`)
                    .then(res => setUserProfile(res.data))
                    .catch(err => console.error("Error fetching user", err));
            }
        }, [id, isLoggedIn, user]);

        
    const userProducts = useMemo(() => {
        if (!userProfile) return [];

        if (userProfile.role === "SELLER") {
            const sellerProducts = products.filter(p => p.sellerId === userProfile.id);
            return sellerProducts;
        } else if (userProfile.role === "BUYER") {
            const purchaseIds = userProfile.purchaseList || userProfile.productList || [];
            
            const buyerProducts = products.filter(p => {
                const productId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
                const normalizedPurchaseIds = purchaseIds.map(id => 
                    typeof id === 'string' ? parseInt(id) : id
                );
                return normalizedPurchaseIds.includes(productId);
            });
            
            return buyerProducts; 
        }
        return [];
    }, [userProfile, products]);

    const canReviewBuyer = () => {
        if (!user || !userProfile) return false;
        if (user.role !== "SELLER") return false;

        return userProfile.productList
            .map(pid => products.find(p => p.id === pid))
            .some(p => p && p.sellerId === user.id && !p.buyerReviewed);
    };

    const canReviewSeller = () => {
        if (!user || !userProfile) return false;
        if (user.role !== "BUYER") return false;

        return userProfile.productList
            .map(pid => products.find(p => p.id === pid))
            .some(p => p && p.sellerId === userProfile.id && !p.sellerReviewed);
    };

    const canReportBuyer = () => {
        if (!user || !userProfile) return false;
        if (user.role !== "SELLER") return false;

        return userProfile.productList
            .map(pid => products.find(p => p.id === pid))
            .some(p => p && p.sellerId === user.id);
    };

    const canReportSeller = () => {
        if (!user || !userProfile) return false;
        if (user.role !== "BUYER") return false;

        return userProfile.productList
            .map(pid => products.find(p => p.id === pid))
            .some(p => p && p.sellerId === userProfile.id);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/mainpage');
    };

    const handleDropdownChange = (event) => {
        setSelectedValue(event.target.value);
        if (event.target.value === '5') {
            setShowOthers(true);
        }
        else {
            setShowOthers(false);
        }
    };

    const submitReview = () => {
        if (!reviewTargetUser) return;
        axios.post(`http://localhost:8080/WebShopAppREST/rest/users/reviews`, {
            reviewerId: user.id,
            reviewedUserId: reviewTargetUser.id,
            rating: reviewScore,
            comment: reviewComment
        })
        .then(res => {
            console.log("Review submitted:", res.data);
            setShowReviewModal(false);
        })
        .catch(err => console.error(err));
    };

    const submitReport = () => {
        let reasonToSend = selectedValue === "Other" ? otherReason.trim() : selectedValue;

        if (!reasonToSend) {
            alert("Please enter a reason for reporting.");
            return;
        }

        axios.post(`http://localhost:8080/WebShopAppREST/rest/report/reports`, {
            submittedByUserId: user.id,
            reportedUserId: reviewTargetUser.id,
            reason: reasonToSend,
            status: "SUBMITTED"
        })
            .then(res => {
            console.log("Report submitted:", res.data);
            setShowReportModal(false);
        })
        .catch(err => console.error(err));
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
            {userProfile && (
                <>
                    {userProfile.role === "SELLER" && (
                        <div className="background">
                            <div className="header">
                                <img className="user-img"
                                     src={userProfile?.profilePicture ? `http://localhost:8080/WebShopAppREST/images/profiles/${userProfile.profilePicture}` : "/icons/account_circle.png"}
                                />
                                <div className="username">
                                    {userProfile.username}
                                </div>
                                <div className="rating">
                                    <div>Average rating:</div>
                                    <div>{userProfile.rating?.toFixed(1) || "0.0"}</div>
                                    {user?.role === "SELLER" && canReviewBuyer() && (
                                        <button className="btn btn-secondary btn-sm review-button" onClick={() => openReviewModal(userProfile)}>
                                            Review Buyer
                                        </button>
                                    )}

                                    {user?.role === "BUYER" && canReviewSeller() && (
                                        <button className="btn btn-secondary btn-sm review-button" onClick={() => openReviewModal(userProfile)}>
                                            Review Seller
                                        </button>
                                    )}
                                </div>
                                <div className="report">
                                    {user?.role === "SELLER" && canReportBuyer() && (
                                        <button className="btn btn-danger btn-sm review-button" onClick={() => openReportModal(userProfile)}>
                                            Report
                                        </button>
                                    )}

                                    {user?.role === "BUYER" && canReportSeller() && (
                                        <button className="btn btn-danger btn-sm review-button" onClick={() => openReportModal(userProfile)}>
                                            Report
                                        </button>
                                    )}                                    
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
                                            <input className="form-control me-2 search" type="search" placeholder={`Search all ${userProfile?.purchaseList?.length || 0} items`} aria-label="Search"/>
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
                                                    <ProductTable 
                                                    products={[product]} 
                                                    onProductClick={(id) => {
                                                        if (userProfile.role === "BUYER") {
                                                        navigate(`/purchased-product/${id}`);
                                                        } else {
                                                        navigate(`/products/${id}`);
                                                        }
                                                    }}
                                                    />
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
                            <div className="feedback-section">
                                {userProfile?.feedback && userProfile.feedback.length > 0 ? (
                                    userProfile.feedback.map(f => (
                                        <div key={f.id} className="feedback-item mb-3 p-2 border rounded">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>{f.reviewerUsername}</strong>
                                                <span>Rating: {f.rating}/5</span>
                                            </div>
                                            <div className="comment">{f.comment}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No feedback yet.</p>
                                )}
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
                                    <div>{userProfile.rating?.toFixed(1) || "0.0"}</div>
                                    {user?.role === "SELLER" && canReviewBuyer() && (
                                        <button className="btn btn-secondary btn-sm review-button" onClick={() => openReviewModal(userProfile)}>
                                            Review Buyer
                                        </button>
                                    )}

                                    {user?.role === "BUYER" && canReviewSeller() && (
                                        <button className="btn btn-secondary btn-sm review-button" onClick={() => openReviewModal(userProfile)}>
                                            Review Seller
                                        </button>
                                    )}
                                </div>
                                <div className="report">
                                    {user?.role === "SELLER" && canReportBuyer() && (
                                        <button className="btn btn-danger btn-sm me-2 review-button" onClick={() => openReportModal(userProfile)}>
                                            Report
                                        </button>
                                    )}

                                    {user?.role === "BUYER" && canReportSeller() && (
                                        <button className="btn btn-danger btn-sm me-2 review-button" onClick={() => openReportModal(userProfile)}>
                                            Report
                                        </button>
                                    )}                                    
                                </div>
                            </div>
                            <div className="profile-details">
                                <div className={`profile-click ${activeTab === "items" ? "active" : ""}`} onClick={() => setActiveTab("items")}>
                                    Purchases ({userProfile?.purchaseList?.length || 0})
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
                                                        <ProductTable 
                                                        products={[product]} 
                                                        onProductClick={(id) => {
                                                            if (userProfile.role === "BUYER") {
                                                            navigate(`/purchased-product/${id}`);
                                                            } else {
                                                            navigate(`/products/${id}`);
                                                            }
                                                        }}
                                                        />
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
                            <div className="feedback-section">
                                {userProfile?.feedback && userProfile.feedback.length > 0 ? (
                                    userProfile.feedback.map(f => (
                                        <div key={f.id} className="feedback-item mb-3 p-2 border rounded">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>{f.reviewerUsername}</strong>
                                                <span>Rating: {f.rating}/5</span>
                                            </div>
                                            <div className="mt-1">{f.comment}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No feedback yet.</p>
                                )}
                            </div>
                        )}
                            </div>
                        </div>
                    )}
                </>
            )}
            {showReviewModal && (
            <>
            <div className="modal-overlay"
                onClick={() => setShowReviewModal(false)}/>
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Leave a Review for {reviewTargetUser.username}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label>Score (1-5):</label>
                                <input type="number" min="1" max="5" value={reviewScore} onChange={e => setReviewScore(Number(e.target.value))} className="form-control mb-2"/>
                                <label>Comment:</label>
                                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="form-control"/>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={submitReview}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            )}
            {showReportModal && (
            <>
            <div className="modal-overlay"
                onClick={() => setShowReportModal(false)}/>
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Report {reviewTargetUser.username}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowReportModal(false)}></button>
                            </div>
                            <div className="modal-body">
                            <select value={selectedValue} onChange={handleDropdownChange} className="form-select" aria-label="Default select example">
                                <option value="">Reason for reporting</option>
                                <option value="Buyer did not pickup product">Buyer did not pickup product</option>
                                <option value="Buyer did not pay for the product">Buyer did not pay for the product</option>
                                <option value="Buyer was unresponsive after purchase">Buyer was unresponsive after purchase</option>
                                <option value="Buyer returned a damaged product">Buyer returned a damaged product</option>
                                <option value="Buyer violated platform rules">Buyer violated platform rules</option>
                                <option value="Other">Other</option>
                            </select>
                                { selectedValue === "Other" && (
                                    <div className="input-group">
                                        <textarea className="form-control" placeholder="Enter your reason" value={otherReason} onChange={e => setOtherReason(e.target.value)}></textarea>
                                    </div>
                                )}                           
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={submitReport}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            )}
        </div>
        
    );
}
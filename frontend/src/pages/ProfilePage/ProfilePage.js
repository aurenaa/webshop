import { useNavigate } from 'react-router-dom';
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUser } from "../../contexts/UserContext";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthorize();
return (
    <div className="main-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
        <span className="navbar-brand">WebShop</span>
        
        <div className="position-absolute start-50 translate-middle-x d-flex">
          <input
            className="form-control me-2"
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
            <img 
              src="/icons/shopping_cart.png" 
              alt="Cart" 
              style={{ width: "30px", height: "30px", marginRight: "15px", cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            />
            <img 
              src="/icons/account_circle.png" 
              alt="User" 
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            />
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate("/signup")} 
              className="btn btn-outline-primary me-2"
            >
              Sign Up
            </button>
            <span 
              onClick={() => navigate("/login")}
              className="nav-link" 
              style={{ cursor: "pointer" }}
            >
              Log in
            </span>
          </>
        )}
        {isLoggedIn && (
          <span 
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="nav-link ms-3" 
            style={{ cursor: "pointer" }}
          >
            Log out
          </span>
        )}
      </div>
      </nav>
    <div className="profile">
        <div className="profile-container">
            <div className="left">
            <div className="basic-info">
                <img src="/icons/account_circle.png" alt="User" className="account"/>
                <div className="username-email">
                <p>{user.username}</p>
                <p>{user.email}</p>
                </div>
            </div>
            <div className="user-info-row">
                <div className="user-info">
                <label>First Name</label>
                <div className="user-field">{user.firstName}</div>
                </div>
                <div className="user-info">
                <label>Last Name</label>
                <div className="user-field">{user.lastName}</div>
                </div>
            </div>
            <div className="user-info-row">
                <div className="user-info">
                <label>Phone Number</label>
                <div className="user-field">{user.phoneNumber}</div>
                </div>
                <div className="user-info">
                <label>Date of Birth</label>
                <div className="user-field">{user?.birthDate || "Optional"}</div>
                </div>
            </div>
            <div className="user-description">
                <label>Description</label>
                <div className="description-field">{user?.description || "Optional"}</div>
            </div>
            </div>
            <div className="right">
            <button className="btn btn-outline-primary edit-btn">Edit</button>
            </div>
        </div>
        </div>
    </div>
  );
}
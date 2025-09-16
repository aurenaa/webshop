import { useNavigate } from 'react-router-dom';
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { useState, useEffect } from "react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthorize();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleEditClick = () => {
    setEditedUser({ 
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        birthDate: user.birthDate || "",
        description: user.description || "",
        password: "",
        currentPassword: ""
      });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser(null);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      if (profileImage) {
        const formData = new FormData();
        formData.append("profileImage", profileImage);
        await axios.patch(
          `http://localhost:8080/WebShopAppREST/rest/users/${user.id}/upload-image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      const payload = {
        description: editedUser.description
      };

      if (
        (editedUser.username !== user.username ||
        editedUser.email !== user.email ||
        (editedUser.password && editedUser.password !== "")) &&
        !editedUser.currentPassword
      ) {
        setMessage("Please enter your current password to change username, email, or password.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8080/WebShopAppREST/rest/users/${user.id}`,
        payload
      );

      setUser(response.data);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="main-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 position-relative">
        <span onClick={() => navigate("/mainPage")} className="navbar-brand">WebShop</span>
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
            <img src="/icons/shopping_cart.png" alt="Cart" style={{ width: "30px", height: "30px", marginRight: "15px", cursor: "pointer" }} onClick={() => navigate("/cart")}/>
            <img src="/icons/account_circle.png" alt="User" style={{ width: "30px", height: "30px", cursor: "pointer" }} onClick={() => navigate("/profile")}/>
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
        {isLoggedIn && (
          <span onClick={() => {
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
            {isEditing ? (
              <form className="edit-form">
                <h3>Edit Profile</h3>
                <label>Profile Image</label>
                <input type="file" accept="image/*" onChange={handleProfileImageChange} />
                <div className="form-row">
                  <div>
                    <label>First Name</label>
                    <input type="text" name="firstName" value={editedUser.firstName || ""} onChange={handleChange}/>
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={editedUser.lastName || ""} onChange={handleChange}/>
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <label>Username</label>
                    <input type="text" name="username" value={editedUser.username || ""} onChange={handleChange}/>
                  </div>
                  <div>
                    <label>Email</label>
                    <input type="email" name="email" value={editedUser.email || ""} onChange={handleChange}/>
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <label>Phone Number</label>
                    <input type="tel" name="phoneNumber" value={editedUser.phoneNumber || ""} onChange={handleChange}/>
                  </div>
                  <div>
                    <label>Date of Birth</label>
                    <input type="date" name="birthDate" value={editedUser.birthDate || ""} onChange={handleChange}/>
                  </div>
                </div>
                <label>About Yourself</label>
                <textarea name="description" value={editedUser.description || ""} onChange={handleChange}/>
                <div className="form-row">
                  <div>
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={editedUser.currentPassword || ""} onChange={handleChange}/>
                  </div>
                  <div>
                    <label>New Password</label>
                    <input type="password" name="password" value={editedUser.password || ""} onChange={handleChange}/>
                  </div>
                </div>
                <div className="buttons">
                  <button type="button" onClick={handleSaveClick} className="btn btn-success me-2">Save</button>
                  <button type="button" onClick={handleCancelClick} className="btn btn-secondary">Cancel</button>
                </div>
                {message && <p className="message">{message}</p>}
              </form>
            ) : (
              <div className="basic-info-container">
                <div className="left-column">
                  <img src="/icons/account_circle.png" alt="User" className="account"/>
                  <div className="username-email">
                    <p>{user.username}</p>
                    <p>{user.email}</p>
                  </div>
                  <div className="buttons">
                    <button onClick={handleEditClick} className="btn btn-outline-primary edit-btn">Edit</button>
                  </div>
                </div>
                <div className="right-column">
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
              </div>
            )}
          </div>
        </div>
        </div>
    </div>
  );
}
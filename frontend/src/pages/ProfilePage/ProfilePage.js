import { useNavigate } from 'react-router-dom';
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { useState, useEffect } from "react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuthorize();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);


  const validateCriticalChanges = () => {
    if (!editedUser) return false;
    const criticalFields = ['username', 'email', 'password'];
    const hasCriticalChange = criticalFields.some(field => {
      if (field === 'password') {
        return editedUser.password && editedUser.password !== "";
      }
      return editedUser[field] !== user[field];
    });

    return hasCriticalChange;
  };

const validatePassword = () => {
    if (editedUser.password && editedUser.password !== "") {
      if (editedUser.password.length < 6) {
        setMessage("New password must be at least 6 characters long.");
        return false;
      }
      if (!editedUser.currentPassword) {
        setMessage("Current password is required to change your password.");
        return false;
      }
    }
    return true;
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(file);
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/mainpage');
  };

  const handleSaveClick = async () => {
    const isCriticalChange = editedUser.username !== user.username || 
                             editedUser.email !== user.email || 
                             (editedUser.password && editedUser.password !== "");    
    try {
      if (validateCriticalChanges() && !editedUser.currentPassword) {
        setMessage("Current password is required to change username, email or password.");
        return;
      }

      if (!validatePassword()) {
        return;
      }

      let updatedProfileImage = editedUser.profilePicture;

      if (profileImage) {
        const formData = new FormData();
        formData.append("profileImage", profileImage);
        formData.append("id", user.id);

        const res = await axios.post(
          "http://localhost:8080/WebShopAppREST/users/upload-image",
          formData
        );

        updatedProfileImage = res.data.profileImage;
      }

      const payload = {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        username: editedUser.username,
        email: editedUser.email,
        phoneNumber: editedUser.phoneNumber,
        birthDate: editedUser.birthDate || null,
        description: editedUser.description,
        password: editedUser.password && editedUser.password !== "" ? editedUser.password : undefined,
        currentPassword: editedUser.currentPassword || undefined
      };

      const response = await axios.patch(
        `http://localhost:8080/WebShopAppREST/rest/users/${user.id}`,
        payload
      );

      setUser({ ...response.data, profileImage: updatedProfileImage  });
      setEditedUser({ ...response.data, profileImage: updatedProfileImage  });

      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setProfileImage(null);

    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setMessage("Current password is incorrect.");
      } else if (error.response && error.response.status === 409) {
        setMessage("Username or email already exists.");
      } else {
        setMessage("Failed to update profile.");
      }
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

    <div className="profile">
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              {isEditing ? (
                <div className="card shadow-sm">
                  <div className="card-header bg-secondary text-white">
                    <h4 className="mb-0">Edit Account</h4>
                  </div>
                  <div className="card-body">
                    <form className="edit-form">
                      <div className="row mb-4">
                        <div className="col-12">
                          <label className="form-label fw-bold">Profile Image</label>
                          <input type="file" className="form-control" accept="image/*" onChange={handleProfileImageChange} />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">First Name</label>
                            <input type="text" className="form-control" name="firstName" value={editedUser.firstName || ""} onChange={handleChange}/>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Last Name</label>
                            <input type="text" className="form-control" name="lastName" value={editedUser.lastName || ""} onChange={handleChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Username</label>
                            <input type="text" className="form-control" name="username" value={editedUser.username || ""} onChange={handleChange}/>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Email</label>
                            <input type="email" className="form-control" name="email" value={editedUser.email || ""} onChange={handleChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Phone Number</label>
                            <input type="tel" className="form-control" name="phoneNumber" value={editedUser.phoneNumber || ""} onChange={handleChange}/>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Date of Birth</label>
                            <input type="date" className="form-control" name="birthDate" value={editedUser.birthDate || ""} onChange={handleChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-12">
                          <label className="form-label fw-bold">About Yourself</label>
                          <textarea className="form-control" rows="4" name="description" value={editedUser.description || ""} onChange={handleChange}/>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Current Password</label>
                            <input 
                              type="password" 
                              className="form-control" 
                              name="currentPassword" 
                              value={editedUser.currentPassword || ""} 
                              onChange={handleChange}
                              placeholder={
                                editedUser.username !== user.username || 
                                editedUser.email !== user.email || 
                                editedUser.password ? "Required for username/email/password changes" : "Optional"
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">New Password</label>
                            <input type="password" className="form-control" name="password" value={editedUser.password || ""} onChange={handleChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex gap-3">
                            <button type="button" onClick={handleSaveClick} className="btn btn-success">Save Changes</button>
                            <button type="button" onClick={handleCancelClick} className="btn btn-danger">Cancel</button>
                          </div>
                        </div>
                      </div>

                      {message && <div className="alert alert-info mt-3">{message}</div>}
                    </form>
                  </div>
                </div>
              ) : (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 border-end">
                        <div className="text-center mb-4">
                          <img
                            src={user?.profilePicture ? `http://localhost:8080/WebShopAppREST/images/profiles/${user.profilePicture}` : "/icons/account_circle.png"}
                            alt="User"
                            className="rounded-circle mb-3"
                            style={{ width: 80, height: 80, objectFit: "cover" }}
                          />
                          <h4 className="mb-1">{user.username}</h4>
                          <p className="text-muted">{user.email}</p>
                          <button onClick={handleEditClick} className="btn btn-outline-primary btn-sm">Edit Profile</button>
                        </div>
                      </div>

                      <div className="col-md-8">
                        <h5 className="mb-4">Personal Information</h5>
                        
                        <div className="row mb-3">
                          <div className="col-sm-6">
                            <label className="form-label fw-bold text-muted">First Name</label>
                            <div className="p-2 bg-light rounded">{user.firstName}</div>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label fw-bold text-muted">Last Name</label>
                            <div className="p-2 bg-light rounded">{user.lastName}</div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-sm-6">
                            <label className="form-label fw-bold text-muted">Phone Number</label>
                            <div className="p-2 bg-light rounded">{user.phoneNumber || "Not provided"}</div>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label fw-bold text-muted">Date of Birth</label>
                            <div className="p-2 bg-light rounded">{user?.birthDate || "Not provided"}</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-bold text-muted">Description</label>
                          <div className="p-3 bg-light rounded" style={{ minHeight: "80px" }}>
                            {user?.description || "No description provided"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
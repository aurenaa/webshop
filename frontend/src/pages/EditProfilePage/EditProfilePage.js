import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import "./EditProfilePage.css";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [description, setDescription] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || "");
      setBirthDate(user.birthDate || "");
      setDescription(user.description || "");
    }
  }, [user]);

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if ((username !== user.username || email !== user.email || newPassword) && !currentPassword) {
      setMessage("Please enter your current password to change username, email, or password.");
      return;
    }

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

      const updatedData = {
        username,
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        birthDate: birthDate || null,
        description,
        password: newPassword || null,
        currentPassword: currentPassword || null
      };

      const response = await axios.patch(
        `http://localhost:8080/WebShopAppREST/rest/users/${user.id}`,
        updatedData
      );

      setUser(response.data);
      setMessage("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setProfileImage(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    }
  };

    return (
    <div className="container">
        <h1 onClick={() => navigate("/mainPage")}>WebShop</h1>
        <div className="form-border">
        <form className="edit-form" onSubmit={handleUpdate}>
            <h3>Edit Profile</h3>

            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={handleProfileImageChange} />

            <div className="form-row">
                <div>
                <label>First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
            </div>

            <div className="form-row">
                <div>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>

            <div className="form-row">
                <div>
                <label>Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                <label>Date of Birth</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
            </div>

            <label>About Yourself</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className="form-row">
                <div>
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>

        {message && <p className="message">{message}</p>}
        </div>
    </div>
    );
}
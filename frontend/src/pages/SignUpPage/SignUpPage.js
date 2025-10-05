import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !firstName || !lastName || !email || !phone || !password || !confirmPassword || !role) {
      setMessage("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/WebShopAppREST/rest/register", {
        firstName,
        lastName,
        username,
        email,
        phoneNumber: phone,
        password,
        role : role,
        blocked: false
      });

    setMessage("Registration successful! You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Username or email already exists.");
      } else if (error.response && error.response.data) {
        setMessage(`Registration failed: ${error.response.data}`);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  }

    const handleHomeClick = () => { 
        navigate('/mainPage'); 
    };

    return (
    <div className="container">
      <h1 onClick={handleHomeClick}>WebShop</h1>
      <div className="form-border">
        <form className="register-form" onSubmit={handleRegister}>
          <h3>Register</h3>
          <div className="user-type-selector">
            <button type="button" onClick={() => setRole("BUYER")} className={`type-button ${role === "BUYER" ? "active" : ""}`}>
              Buyer
            </button>
            <button type="button" onClick={() => setRole("SELLER")} className={`type-button ${role === "SELLER" ? "active" : ""}`}>
              Seller
            </button>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
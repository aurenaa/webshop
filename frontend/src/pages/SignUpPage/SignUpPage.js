import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !firstName || !lastName || !email || !phone || !password) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/WebShopAppREST/rest/register", {
        firstName,
        lastName,
        username,
        email,
        phoneNumber: phone,
        password,
        role: "BUYER",
        blocked: false
      });

    setMessage("Registration successful! You can now login.");
    } catch (error) {
      setMessage("Registration failed.");
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
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
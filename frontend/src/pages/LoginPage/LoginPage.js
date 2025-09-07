import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthorize();

  const [step, setStep] = useState(1); // 1 = username, 2 = password, 3 = register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const checkUsername = async () => {
    if (!username) {
      setMessage("Enter username.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/WebShopAppREST/rest/check-username/${username}`
      );
      
      if (response.data.exists) {
        setStep(2);
        setMessage("");
      } else {
        setStep(3);
        setMessage("New user. Register to continue.");
      }
    } catch (error) {
      setMessage("Error checking username.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !password) {
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
    setStep(2);
    } catch (error) {
      setMessage("Registration failed.");
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setMessage("Enter the password.");
      return;
    }
    try {
      await axios.post("http://localhost:8081/WebShopAppREST/rest/login", {
        username,
        password,
      });
      
      setMessage("You're logged in. Redirecting you back to the homepage.");
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      setMessage("Wrong password.");
    }
  };

  const handleHomeClick = () => { 
    navigate('/mainPage'); 
  };

  return (
      <div className="container">
        <h1 onClick={handleHomeClick}>WebShop</h1>
        <div className="form-border">
          {step === 1 ? (
            <div className="form">
              <div>Login or create account</div>
              <div>Enter username</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <button onClick={checkUsername}>Continue</button>
            </div>
          ) : step === 2 ? (
            <form onSubmit={handleLogin}>
              <div className="login-form">
                <div>Login</div>
                <p>Welcome, {username}</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button type="submit">Login</button>
              </div>          
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="register-form">
                <div>Register</div>
                <p>Username: {username}</p>
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
                <button type="submit">Register</button>
              </div>          
            </form>
          )}
          
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
}
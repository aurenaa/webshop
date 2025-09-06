import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthorize();

  const [step, setStep] = useState(1); // 1 = username, 2 = password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        setMessage("New User. Register to continue.");
      }
    } catch (error) {
      setMessage("Error checking username.");
    }
  };

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

  return (
    <div className="container">
      <h1>WebShop</h1>
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
        ) : (
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
        )}
        
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
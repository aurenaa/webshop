import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useUsersList } from "../../hooks/useUsersList";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setIsLoggedIn, login } = useAuthorize();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const usersList = useUsersList() || [];
  const admins = usersList.filter(u => u.role == "ADMINISTRATOR");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Enter username and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/WebShopAppREST/rest/login",
        { username, password }
      );

      const { userId } = response.data;

      login(userId);
      setIsLoggedIn(true);

      const isAdmin = admins.some(a => a.id === userId);
      
      if (isAdmin) {
        navigate("/adminpage");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage("Wrong username or password.");
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  const handleHomeClick = () => { 
    navigate('/mainPage'); 
  };

  return (
    <div className="container">
      <h1 onClick={handleHomeClick}>WebShop</h1>
      <div className="form-border">
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="btn btn-primary" type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p>Don’t have an account?</p>
        <button onClick={goToSignUp} className="btn btn-secondary">
          Sign Up
        </button>
      </div>
    </div>
  );
}
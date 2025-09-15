import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthorize } from "./AuthorizeContext";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { userId, isLoggedIn } = useAuthorize();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/WebShopAppREST/rest/users/${userId}`
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        setUser(null); 
      }
    };

    fetchUser();
  }, [userId, isLoggedIn]);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

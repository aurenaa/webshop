import { createContext, useContext, useState } from "react";

const AuthorizeContext = createContext();

export function useAuthorize() {
  return useContext(AuthorizeContext);
}

export function AuthorizeProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
  };

  const value = { isLoggedIn, setIsLoggedIn , userId, login };

  return (
    <AuthorizeContext.Provider value={value}>
      {children}
    </AuthorizeContext.Provider>
  );
}
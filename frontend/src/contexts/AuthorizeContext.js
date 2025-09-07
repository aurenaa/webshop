import { createContext, useContext, useState } from "react";

const AuthorizeContext = createContext();

export function useAuthorize() {
  return useContext(AuthorizeContext);
}

export function AuthorizeProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const value = { isLoggedIn, setIsLoggedIn };

  return (
    <AuthorizeContext.Provider value={value}>
      {children}
    </AuthorizeContext.Provider>
  );
}
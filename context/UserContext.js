"use client";
import { createContext, useState } from "react";
import { useContext } from "react";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    if (!window.localStorage.getItem("token")) {
      return;
    }
    if (userData) {
      window.localStorage.setItem("user", JSON.stringify(userData));
    }
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    window.localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

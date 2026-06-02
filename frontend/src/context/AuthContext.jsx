import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;

  const verifyUser = async () => {
    try {
      const response = await fetch(`${api}/user/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = await response.json();
      if (userData.success) {
        setUser(userData.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Don't log syntax errors from HTML responses as they are expected when not logged in or backend down
      if (!(error instanceof SyntaxError)) {
        console.error("Error verifying user session:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, [api]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${api}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.removeItem("token"); // Cleanup legacy
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [me, setMe] = useState(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("me");
    if (token && user) {
      try {
        setMe(JSON.parse(user));
        setAuthed(true);
      } catch {
        setMe(null);
        setAuthed(false);
      }
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("me", JSON.stringify(user));
    setMe(user);
    setAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    setMe(null);
    setAuthed(false);
  };

  const hasRole = (roleToCheck) => {
    return authed && me && me.uloga === roleToCheck;
  };

  return (
    <AuthContext.Provider value={{ me, authed, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
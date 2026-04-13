// src/lib/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;

  phone?: string | null;
  employeeId?: string | null;
  assignedArea?: string | null;
  profileImage?: string | null;

  isActive?: boolean;
  createdById?: string | null;

  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;

  login: (data: {
    access_token: string;
    refresh_token: string;
    user: User;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  //   useEffect(() => {
  //     const storedUser = localStorage.getItem("userData");
  //     if (storedUser) {
  //       setUser(JSON.parse(storedUser));
  //     }
  //   }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid userData in localStorage", err);
        localStorage.removeItem("userData");
      }
    }
  }, []);

  //   const login = ({ access_token, refresh_token, user }: any) => {
  //     localStorage.setItem("access_token", access_token);
  //     localStorage.setItem("refresh_token", refresh_token);
  //     localStorage.setItem("userData", JSON.stringify(user));

  //     setUser(user);
  //   };

  const login = ({ access_token, refresh_token, user }: any) => {
    if (!user) {
      console.error("Login called with invalid user");
      return;
    }

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("userData", JSON.stringify(user));

    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    // window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

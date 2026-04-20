// src/lib/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";
import Swal from "sweetalert2";

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

// type AuthContextType = {
//   user: User | null;
//   isAuthenticated: boolean;

//   login: (data: {
//     access_token: string;
//     refresh_token: string;
//     user: User;
//   }) => void;
//   logout: () => void;
// };
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

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

    setLoading(false);
  }, []);

  //   useEffect(() => {
  //     const storedUser = localStorage.getItem("userData");
  //     if (storedUser) {
  //       setUser(JSON.parse(storedUser));
  //     }
  //   }, []);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("userData");

  //   if (storedUser && storedUser !== "undefined") {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //     } catch (err) {
  //       console.error("Invalid userData in localStorage", err);
  //       localStorage.removeItem("userData");
  //     }
  //   }
  // }, []);

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

  const logout = async () => {
    try {
      await AuthService.logout();
      localStorage.clear();
      setUser(null);
      // window.location.href = "/login";
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: "Please try again later",
      });
      console.error("Logout logging out user", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!localStorage.getItem("access_token"),
        login,
        logout,
        loading,
      }}
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

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (email: string, fullName: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const login = (email: string, password: string) => {
    // Mock accounts
    const accounts = [
      {
        email: "superadmin@gmail.com",
        password: "superadmin",
        role: "superadmin",
      },
      { email: "admin@gmail.com", password: "admin", role: "admin" },
    ];

    const account = accounts.find(
      (acc) => acc.email === email && acc.password === password,
    );

    if (account) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", account.role);
      router.push(`/${account.role}`);
      return true;
    }

    return false;
  };

  const signup = (email: string, fullName: string, password: string) => {
    console.log("Signup attempt:", { email, fullName, password });

    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("adminRole", "admin");
    router.push("/auth");
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("userRole");
    setTimeout(() => {
      router.push("/auth");
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

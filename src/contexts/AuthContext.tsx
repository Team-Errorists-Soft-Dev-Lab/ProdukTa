"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Admin } from "@prisma/client";
import { handleLogin, handleSignup, handleLogout } from "@/lib/auth-handlers";
import { toast } from "sonner";

interface SessionResponse {
  user: Admin | null;
  error?: string;
}

interface AuthContextType {
  user: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (
    email: string,
    name: string,
    password: string,
    sectorId: string,
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = (await response.json()) as SessionResponse;

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.user) {
          setUser(data.user);
          if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/signup"
          ) {
            router.push(data.user.isSuperadmin ? "/superadmin" : "/admin");
          }
        } else {
          if (!/^\/(login|signup|guest)/.exec(window.location.pathname)) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const { user: authUser, error } = await handleLogin(formData);

      if (error) {
        return { error };
      }

      if (!authUser) {
        return { error: "Invalid email or password" };
      }

      setUser(authUser);
      router.push(authUser.isSuperadmin ? "/superadmin" : "/admin");
      return {};
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return { error: message };
    }
  };

  const signup = async (
    email: string,
    name: string,
    password: string,
    sectorId: string,
  ) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);
      formData.append("sectorId", sectorId);

      const { error } = await handleSignup(formData);

      if (error) {
        return { error };
      }

      toast.success("Signup successful!", {
        description: "Please wait for admin verification before logging in.",
        duration: 5000,
      });

      router.push("/login");
      return {};
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return { error: message };
    }
  };

  const logout = async () => {
    try {
      await handleLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
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

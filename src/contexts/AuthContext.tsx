"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Admin } from "@prisma/client";
import { handleLogin, handleSignup, handleLogout } from "@/lib/auth-handlers";
import { toast } from "sonner";
import LoadingPage from "@/components/loading/Loading";

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
    let isSubscribed = true;
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session?" + Date.now(), {
          credentials: "same-origin",
        });

        if (!isSubscribed) return;

        const data = (await response.json()) as SessionResponse;

        if (!response.ok) throw new Error(data.error);

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        if (!isSubscribed) return;
        setUser(null);
        if (error instanceof TypeError) {
          setTimeout(() => void checkSession(), 1000);
        }
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    void checkSession();
    return () => {
      isSubscribed = false;
    };
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

      if (authUser.isSuperadmin) {
        router.push("/superadmin");
      } else {
        const adminWithSector = await fetch(`/api/admin/${authUser.id}/sector`);
        const { sector }: { sector: { name: string } } =
          (await adminWithSector.json()) as { sector: { name: string } };

        if (sector) {
          const formattedSectorName = sector.name
            .toLowerCase()
            .replace(/\s+/g, "");
          router.push(`/admin/dashboard/${formattedSectorName}`);
        }
      }

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
      <div className="contents">{isLoading ? <LoadingPage /> : children}</div>
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

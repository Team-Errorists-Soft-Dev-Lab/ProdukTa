"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Sector {
  id: number;
  name: string;
}

interface ApiResponse {
  sectors: Sector[];
  error?: string;
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sector, setSector] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoadingSectors, setIsLoadingSectors] = useState(true);
  const { signup } = useAuth();

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch("/api/sectors");
        if (!response.ok) throw new Error("Failed to fetch sectors");

        const data = (await response.json()) as ApiResponse;

        if (data.error) {
          throw new Error(data.error);
        }

        setSectors(data.sectors);
      } catch (error) {
        console.error("Error fetching sectors:", error);
        toast.error("Failed to load sectors");
      } finally {
        setIsLoadingSectors(false);
      }
    };

    void fetchSectors();
  }, []);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!sector) {
      setError("Please select an MSME Sector");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(email, fullName, password, sector);

      if (result.error) {
        if (result.error === "Email is already registered") {
          setError(
            "This email is already registered. Please use a different email or login to your existing account.",
          );
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-[#e8e0d8] p-4">
      <motion.div
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex justify-center">
          <Image
            src="/ProdukTa_Logo.png"
            alt="ProdukTa Logo"
            width={100}
            height={100}
            className="h-auto w-auto"
          />
        </div>
        <h1 className="mb-6 text-center text-3xl font-bold text-[#b08968]">
          Create your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              className="mt-1 w-full appearance-none rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-[#b08968] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              className="mt-1 w-full appearance-none rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-[#b08968] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-[#b08968] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                id="confirmPassword"
                className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-[#b08968] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="sector"
              className="block text-sm font-medium text-gray-700"
            >
              MSME Sector
            </label>
            <Select
              value={sector}
              onValueChange={setSector}
              disabled={isLoadingSectors}
            >
              <SelectTrigger
                id="sector"
                className="mt-1 w-full border-gray-300"
              >
                <SelectValue
                  placeholder={
                    isLoadingSectors
                      ? "Loading sectors..."
                      : "Select MSME Sector"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id.toString()}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#b08968] px-4 py-2 font-medium text-white transition duration-150 ease-in-out hover:bg-[#9a7b5f] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#b08968] transition duration-150 ease-in-out hover:text-[#9a7b5f] hover:underline focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import type Sector from "@prisma/client";
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
import {
  EyeIcon,
  EyeOffIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  getPasswordStrength,
  getPasswordStrengthRules,
  checkPasswords,
} from "@/lib/password-strength";
import type { SignupSector } from "@/types/sector";
import type { ApiResponse } from "@/types/APIResponse";

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
  const [sectors, setSectors] = useState<SignupSector[]>([]);
  const [isLoadingSectors, setIsLoadingSectors] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
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
    if (!sector) {
      setError("Please select an MSME Sector");
      return false;
    }

    const validationError = checkPasswords(password, confirmPassword);
    if (validationError) {
      setError(validationError);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-[#e8e0d8]">
      <motion.div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex justify-center">
          <Image
            src="/ProdukTa_Logo.png"
            alt="ProdukTa Logo"
            width={80}
            height={80}
            className="h-auto w-auto"
          />
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold text-[#b08968] md:text-3xl">
          Create your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
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
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
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
              {isPasswordFocused && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex w-full space-x-1">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const strength = getPasswordStrength(password);
                        return (
                          <div
                            key={i}
                            className={`h-1 w-1/4 rounded-full ${
                              i < strength.score
                                ? strength.color
                                : "bg-gray-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="ml-2 min-w-16 text-right text-xs">
                      {getPasswordStrength(password).message}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-gray-500">
                    {getPasswordStrengthRules(password).map((rule, index) => (
                      <li key={index} className="flex items-center">
                        <span
                          className={`mr-1 ${rule.isValid ? "text-green-500" : "text-gray-400"}`}
                        >
                          {rule.isValid ? (
                            <CheckCircle size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                        </span>
                        {rule.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
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
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 flex items-center text-xs text-red-500">
                  <AlertCircle size={12} className="mr-1" />
                  Passwords do not match
                </p>
              )}
            </div>
            <div className="md:col-span-2">
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
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p
                className="flex items-center text-sm text-red-600"
                role="alert"
              >
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-md bg-[#b08968] px-4 py-3 font-medium text-white transition duration-150 ease-in-out hover:bg-[#9a7b5f] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Up...
              </span>
            ) : (
              "Create Account"
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

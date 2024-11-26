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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
      if (!sector) {
        setError("Please select an MSME Sector");
        setIsLoading(false);
        return;
      }
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
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4f1]">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/ProdukTa_Logo.png"
            alt="ProdukTa Logo"
            width={80}
            height={80}
            className="h-auto w-auto"
          />
        </div>
        <h1 className="mb-6 text-center text-2xl font-semibold text-[#b08968]">
          Create your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:border-[#b08968] focus:outline-none"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className="w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:border-[#b08968] focus:outline-none"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              className="w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:border-[#b08968] focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="relative">
            <input
              className="w-full appearance-none rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:border-[#b08968] focus:outline-none"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <Select
            value={sector}
            onValueChange={setSector}
            disabled={isLoadingSectors}
          >
            <SelectTrigger className="w-full border-gray-200">
              <SelectValue
                placeholder={
                  isLoadingSectors ? "Loading sectors..." : "Select MSME Sector"
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#b08968] px-4 py-3 font-medium text-white hover:bg-[#9a7b5f] disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#b08968] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

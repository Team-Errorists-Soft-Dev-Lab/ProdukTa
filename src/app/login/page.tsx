"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
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
    <div className="flex min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center">
        <div className="w-1/2 pr-8">
          <div className="rounded-lg bg-white p-10">
            <h1 className="mb-8 text-4xl font-semibold text-gray-800">
              Welcome back!
            </h1>
            <p className="mb-8 text-gray-600">Please enter your details.</p>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  className="mb-2 block text-base font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email:
                </label>
                <input
                  className="w-full appearance-none rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-[#b08968] focus:outline-none focus:ring-1 focus:ring-[#b08968]"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="mb-2 block text-base font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password:
                </label>
                <div className="relative">
                  <input
                    className="w-full appearance-none rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-[#b08968] focus:outline-none focus:ring-1 focus:ring-[#b08968]"
                    id="password"
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
              </div>
              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
              <div>
                <button
                  className="w-full rounded-md bg-[#b08968] px-5 py-3 font-semibold text-white transition duration-150 ease-in-out hover:bg-[#9a7b5f] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-offset-2 disabled:opacity-50"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-[#b08968] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <div className="flex w-1/2 items-center justify-center">
          <Image
            src="/ProdukTa_Logo.png"
            alt="ProdukTa Logo"
            width={400}
            height={400}
            className="h-auto max-w-full"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sector, setSector] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (!sector) {
        setError("Please select an MSME Sector");
        return;
      }
    }

    const success = isLogin
      ? login(email, password)
      : signup(email, fullName, password);

    if (!success) {
      setError(isLogin ? "Invalid email or password" : "Signup failed");
    }
  };

  if (isLogin) {
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
                  <input
                    className="w-full appearance-none rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-[#b08968] focus:outline-none focus:ring-1 focus:ring-[#b08968]"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-base text-red-600">{error}</p>}
                <div>
                  <button
                    className="w-full rounded-md bg-[#b08968] px-5 py-3 font-semibold text-white transition duration-150 ease-in-out hover:bg-[#9a7b5f] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-offset-2"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  className="font-medium text-[#b08968] hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </button>
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
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-full border-gray-200">
              <SelectValue placeholder="Select MSME Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bamboo">Bamboo</SelectItem>
              <SelectItem value="coffee">Coffee</SelectItem>
              <SelectItem value="cacao">Cacao</SelectItem>
              <SelectItem value="coconut">Coconut</SelectItem>
              <SelectItem value="processed-foods">Processed Foods</SelectItem>
              <SelectItem value="it-bpm">IT-BPM</SelectItem>
              <SelectItem value="wearables-homestyles">
                Wearables and Homestyles
              </SelectItem>
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-[#b08968] px-4 py-3 font-medium text-white hover:bg-[#9a7b5f]"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            className="font-medium text-[#b08968] hover:underline"
            onClick={() => setIsLogin(true)}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

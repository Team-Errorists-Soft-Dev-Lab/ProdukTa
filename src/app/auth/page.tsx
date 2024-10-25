"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError("Invalid email or password");
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
            <form onSubmit={handleLogin} className="space-y-8">
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

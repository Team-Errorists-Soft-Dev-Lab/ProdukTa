"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { EyeIcon, EyeOffIcon, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
      if (!result?.error) {
        toast.success("Logged in successfully!", {
          duration: 2000,
        });
      }
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f5f0eb] to-[#e8e0d8]">
      <div className="mx-auto flex w-full max-w-6xl items-center p-4 md:p-8">
        <motion.div
          className="w-full overflow-hidden rounded-3xl bg-white p-8 shadow-2xl md:w-1/2 lg:p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8 flex justify-center md:justify-start">
            <Image
              src="/ProdukTa_Logo.png"
              alt="ProdukTa Logo"
              width={80}
              height={80}
              className="h-auto w-auto"
            />
          </div>
          <motion.h1
            className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl"
            variants={itemVariants}
          >
            Welcome back!
          </motion.h1>
          <motion.p className="mb-8 text-gray-600" variants={itemVariants}>
            Please enter your details to log in to your account.
          </motion.p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-[#b08968] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between">
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-[#b08968] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>
            {error && (
              <motion.div
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                role="alert"
                variants={itemVariants}
              >
                <p>{error}</p>
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
              <button
                className="group flex w-full items-center justify-center rounded-lg bg-[#b08968] px-5 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-[#9a7b5f] focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-offset-2 disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.p
            className="mt-8 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#b08968] transition duration-150 ease-in-out hover:text-[#9a7b5f] hover:underline focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:ring-opacity-50"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
        <motion.div
          className="hidden w-1/2 items-center justify-center md:flex"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute -left-4 top-1/2 h-3/4 w-3/4 -translate-y-1/2 rounded-3xl opacity-20"></div>
            <div className="absolute -right-4 top-1/2 h-3/4 w-3/4 -translate-y-1/2 rounded-3xl opacity-20"></div>
            <div className="relative flex h-full w-full items-center justify-center">
              <Image
                src="/Produkta1.png"
                alt="ProdukTa Logo"
                width={400}
                height={400}
                className="h-auto max-w-full scale-110"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

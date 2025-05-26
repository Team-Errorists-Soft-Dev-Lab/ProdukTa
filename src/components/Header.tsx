"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: "Home", path: "/landing-page" },
    { name: "About Us", path: "/about-us" },
    { name: "Search MSME", path: "/guest" },
    { name: "Export", path: "/guest-export" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="relative bg-gradient-to-r from-white via-[#fafafa] to-white p-4 shadow-sm backdrop-blur-sm">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #8B4513 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex items-center justify-between">
        <motion.div
          className="flex cursor-pointer items-center space-x-2"
          onClick={() => router.push("/landing-page")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B4513]/10 to-[#8B4513]/5 blur-lg" />
            <Image
              src="/Produkta2.png"
              alt="ProdukTa Logo"
              width={230}
              height={230}
              className="relative rounded-full drop-shadow-md transition-all duration-300 hover:drop-shadow-lg"
            />
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-2 text-base md:flex">
          {navigationItems.map(({ name, path }, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleNavigation(path)}
                variant="ghost"
                className={`relative overflow-hidden rounded-full px-6 py-2 text-[#996439] transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-[#8B4513] hover:to-[#6d3610] hover:text-white hover:shadow-lg ${
                  pathname === path
                    ? "bg-gradient-to-r from-[#8B4513] to-[#6d3610] text-white shadow-md"
                    : "hover:bg-[#8B4513]/10"
                }`}
              >
                <span className="relative z-10">{name}</span>
                {pathname === path && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#6d3610] to-[#8B4513]"
                    layoutId="activeTab"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}

          <motion.div
            className="ml-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="relative cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.dti.gov.ph/regions/region-6/",
                  "_blank",
                )
              }
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B4513]/10 to-transparent blur-md" />
              <Image
                src="/DTI_logo.png"
                alt="DTI Logo"
                width={60}
                height={60}
                className="relative drop-shadow-sm transition-all duration-300 hover:drop-shadow-md"
              />
            </div>
          </motion.div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative h-12 w-12 rounded-full bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-[#8B4513]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-[#8B4513]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-white/90 p-4 shadow-xl backdrop-blur-md md:hidden"
          >
            <div className="space-y-2">
              {navigationItems.map(({ name, path }, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => handleNavigation(path)}
                    variant="ghost"
                    className={`relative w-full justify-start rounded-xl p-4 text-left transition-all duration-300 ${
                      pathname === path
                        ? "bg-gradient-to-r from-[#8B4513] to-[#6d3610] text-white shadow-md"
                        : "text-[#996439]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          pathname === path ? "bg-white" : "bg-[#8B4513]/30"
                        }`}
                      />
                      <span className="font-medium">{name}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}

              {/* Mobile DTI Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex justify-center pt-4"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://www.dti.gov.ph/regions/region-6/",
                      "_blank",
                    )
                  }
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B4513]/10 to-transparent blur-md" />
                  <Image
                    src="/DTI_logo.png"
                    alt="DTI Logo"
                    width={50}
                    height={50}
                    className="relative drop-shadow-sm"
                  />
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

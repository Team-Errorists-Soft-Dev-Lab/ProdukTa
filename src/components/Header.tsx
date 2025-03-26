"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="bg-white p-4">
      <div className="flex items-center justify-between">
        <div
          className="flex cursor-pointer items-center space-x-2"
          onClick={() => router.push("/landing-page")}
        >
          <Image
            src="/ProdukTa2.png"
            alt="ProdukTa Logo"
            width={230}
            height={230}
            className="rounded-full"
          />
        </div>
        <nav className="hidden items-center space-x-6 text-base md:flex">
          {[
            { name: "Home", path: "/landing-page" },
            { name: "About Us", path: "/about-us" },
            { name: "Search MSME", path: "/guest" },
            { name: "Export", path: "" },
          ].map(({ name, path }) => (
            <Button
              key={path}
              onClick={() => router.push(path)}
              variant="ghost"
              className={`text-[#996439] transition duration-300 hover:bg-[#8B4513] hover:text-white ${pathname === path ? "bg-[#8B4513] text-white" : ""}`}
            >
              {name}
            </Button>
          ))}
          <Image src="/DTI_logo.png" alt="DTI Logo" width={60} height={60} />
        </nav>
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:bg-[#8B4513]"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="mt-4 flex flex-col space-y-2 text-base md:hidden">
          {[
            { name: "Home", path: "/landing-page" },
            { name: "About Us", path: "/about-us" },
            { name: "Search MSME", path: "/guest" },
            { name: "Export", path: "" },
          ].map(({ name, path }) => (
            <Button
              key={path}
              onClick={() => router.push(path)}
              className={`w-full text-[#996439] transition duration-300 hover:bg-[#8B4513] hover:text-white ${pathname === path ? "bg-[#8B4513] text-white" : ""}`}
            >
              {name}
            </Button>
          ))}
        </nav>
      )}
    </header>
  );
}

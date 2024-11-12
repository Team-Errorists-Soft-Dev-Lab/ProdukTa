"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const logIn = () => {
    router.push("/auth");
  };

  return (
    <header className="bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/ProdukTa_Logo.png"
            alt="ProdukTa Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[#8B4513]">ProdukTa</span>
            <span className="text-sm text-gray-600">
              Everything local, in one place
            </span>
          </div>
        </div>
        <div className="hidden items-center space-x-4 md:flex">
          <Button
            variant="default"
            className="bg-[#996439] text-white hover:bg-[#8B4513]"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
          >
            Export
          </Button>
          <Button
            variant="ghost"
            className="text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
            onClick={logIn}
          >
            Login
          </Button>
          <Image src="/DTI_logo.png" alt="DTI Logo" width={40} height={40} />
        </div>
        <div className="flex items-center space-x-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:bg-[#8B4513]"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 hover:bg-[#8B4513]" />
            ) : (
              <Menu className="h-6 w-6 hover:bg-[#8B4513]" />
            )}
          </Button>
          <Image src="/DTI_logo.png" alt="DTI Logo" width={40} height={40} />
        </div>
      </div>
      {isMenuOpen && (
        <div className="mt-4 flex flex-col space-y-2 md:hidden">
          <Button
            variant="default"
            className="w-full bg-[#996439] text-white hover:bg-[#8B4513]"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
          >
            Export
          </Button>
        </div>
      )}
    </header>
  );
}

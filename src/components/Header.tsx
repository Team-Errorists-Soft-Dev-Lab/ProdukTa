import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white p-4">
      <div className="flex items-center space-x-2">
        <Image
          src="/ProdukTa_Logo.svg"
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
      <div className="flex items-center space-x-4">
        <Button
          variant="default"
          className="bg-[#CD853F] text-white hover:bg-[#8B4513]"
        >
          Home
        </Button>
        <Button variant="ghost" className="text-[#8B4513]">
          Export
        </Button>
        <Image src="/DTI_logo.png" alt="DTI Logo" width={40} height={40} />
      </div>
    </header>
  );
}

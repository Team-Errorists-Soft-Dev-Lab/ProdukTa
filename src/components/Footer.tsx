import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center border-t bg-white p-4">
      <div className="text-sm text-gray-500">
        © 2022 Brand, Inc.
        <Button variant="link" className="text-[#8B4513]">
          Privacy
        </Button>
        <Button variant="link" className="text-[#8B4513]">
          Terms
        </Button>
        <Button variant="link" className="text-[#8B4513]">
          Sitemap
        </Button>
      </div>
      <div className="flex space-x-4">
        {["X", "Instagram", "Facebook", "Youtube"].map((social) => (
          <a key={social} href="#" className="text-[#8B4513]">
            <span className="sr-only">{social}</span>
            <div className="h-6 w-6">
              {/* <img src={`${social}.svg`} alt={social} className="h-full w-full" /> */}
              <Image
                src={`/${social}.svg`}
                alt={social}
                width={24}
                height={24}
              />
            </div>
          </a>
        ))}
      </div>
    </footer>
  );
}

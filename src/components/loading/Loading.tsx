"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white">
      <Image
        src="/ProdukTa1.png"
        alt="Logo"
        width={300}
        height={300}
        className="object-contain"
      />

      <div className="flex items-center gap-2">
        <span className="text-xl text-black">Loading...</span>
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-transparent border-t-emerald-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

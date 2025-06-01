"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import {
  Coffee,
  Sprout,
  Candy,
  Palmtree,
  Monitor,
  Utensils,
} from "lucide-react";

// Type for the API response
interface MSMEData {
  sectorId: string;
  count: number;
  sectorName: string;
  topMSMEs: {
    id: string;
    name: string;
    address: string;
    createdAt: string;
  }[];
}

export default function Hero() {
  const router = useRouter();
  const [totalMSMEs, setTotalMSMEs] = useState(100); // Default fallback value

  useEffect(() => {
    const fetchMSMECount = async () => {
      try {
        const response = await fetch("/api/msme/count");
        if (response.ok) {
          const data = (await response.json()) as {
            formattedMSMEs: MSMEData[];
          };
          const total = data.formattedMSMEs.reduce(
            (sum: number, sector: MSMEData) => sum + sector.count,
            0,
          );
          setTotalMSMEs(total);
        }
      } catch (error) {
        console.error("Error fetching MSME count:", error);
        // Keep default value on error
      }
    };

    void fetchMSMECount();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] pb-12 pt-12 md:pb-16 md:pt-16">
      {/* Enhanced decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-r from-[#8B4513]/20 to-[#8B4513]/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-48 w-48 rounded-full bg-gradient-to-l from-[#8B4513]/15 to-transparent blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#8B4513]/5 to-transparent blur-xl" />

        {/* Mobile-friendly smaller decorative elements */}
        <div className="absolute right-4 top-20 h-20 w-20 rounded-full bg-gradient-to-br from-[#8B4513]/10 to-transparent blur-xl md:hidden" />
        <div className="from-[#8B4513]/8 absolute bottom-20 left-4 h-16 w-16 rounded-full bg-gradient-to-tr to-transparent blur-lg md:hidden" />
      </div>

      {/* Floating sector icons - hidden on mobile for cleaner look */}
      <motion.div
        className="absolute left-10 top-20 hidden lg:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm">
          <Coffee className="h-6 w-6 text-[#000000]" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-16 top-32 hidden lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-md backdrop-blur-sm">
          <Sprout className="h-5 w-5 text-[#4CAF50]" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-20 hidden lg:block"
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/75 shadow-md backdrop-blur-sm">
          <Candy className="h-5 w-5 text-[#8B4513]" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-20 hidden lg:block"
        animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/65 shadow-sm backdrop-blur-sm">
          <Palmtree className="h-4 w-4 text-[#FF0000]" />
        </div>
      </motion.div>

      {/* Mobile floating element with sector icon */}
      <motion.div
        className="absolute right-6 top-16 block lg:hidden"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-md backdrop-blur-sm">
          <Utensils className="h-4 w-4 text-[#FF8C00]" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-6 block lg:hidden"
        animate={{ y: [0, 6, 0], rotate: [0, 8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 shadow-sm backdrop-blur-sm">
          <Monitor className="h-3 w-3 text-[#2196F3]" />
        </div>
      </motion.div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 sm:px-6 md:flex-row md:gap-12 md:px-8">
        {/* Image Section */}
        <motion.div
          className="relative mb-6 flex w-full justify-center md:mb-4 md:w-3/5 md:justify-start"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative w-[90%] sm:w-[85%] md:w-full"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1.02 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            {/* Glow effect behind image */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B4513]/20 to-[#8B4513]/10 blur-2xl" />
            <Image
              src="/landing-bg.png"
              alt="Iloilo cultural and architectural highlights"
              width={800}
              height={800}
              className="relative h-auto w-full object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="relative w-full space-y-6 px-2 text-center sm:px-4 md:w-2/5 md:px-0 md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B4513]/10 to-[#8B4513]/5 px-4 py-2 backdrop-blur-sm sm:px-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#8B4513]" />
            <span className="text-xs font-semibold text-[#8B4513] sm:text-sm">
              Iloilo&apos;s Premier MSME Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-3xl font-bold leading-tight text-[#8B4513] sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover and Support{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#6d3610] bg-clip-text text-transparent">
                Iloilo&apos;s MSMEs
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#8B4513] to-transparent sm:-bottom-2 sm:h-1"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mx-auto max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg md:mx-0 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Discover and support local enterprises that drive Iloilo&apos;s
            economy. Explore the MSME directory to find businesses, learn their
            stories, and see their products.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col items-center gap-3 pt-4 sm:gap-4 md:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#8B4513] to-[#6d3610] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#8B4513]/25 sm:px-8 sm:py-3.5 md:w-auto"
              onClick={() => router.push("/guest")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 text-sm sm:text-base">
                Search Directory Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6d3610] to-[#8B4513] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.button>

            <motion.button
              className="group flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#8B4513]/30 bg-white/50 px-6 py-3 font-semibold text-[#8B4513] backdrop-blur-sm transition-all duration-300 hover:border-[#8B4513] hover:bg-[#8B4513]/5 hover:shadow-lg md:w-auto"
              onClick={() => {
                const element = document.getElementById("data-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm sm:text-base">Learn More</span>
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </motion.button>
          </motion.div>

          {/* Stats Preview - Enhanced mobile layout */}
          <motion.div
            className="flex items-center justify-center gap-4 pt-6 sm:gap-6 md:justify-start md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div className="text-xl font-bold text-[#8B4513] sm:text-2xl">
                {totalMSMEs}+
              </div>
              <div className="text-xs text-neutral-500 sm:text-sm">MSMEs</div>
            </div>
            <div className="h-6 w-px bg-neutral-300 sm:h-8" />
            <div className="text-center">
              <div className="text-xl font-bold text-[#8B4513] sm:text-2xl">
                7
              </div>
              <div className="text-xs text-neutral-500 sm:text-sm">Sectors</div>
            </div>
            <div className="h-6 w-px bg-neutral-300 sm:h-8" />
            <div className="text-center">
              <div className="text-xl font-bold text-[#8B4513] sm:text-2xl">
                100%
              </div>
              <div className="text-xs text-neutral-500 sm:text-sm">Local</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

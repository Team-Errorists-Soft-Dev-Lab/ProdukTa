"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiUsers } from "react-icons/fi";
import { Sprout, Monitor, Candy } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function CallToAction() {
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] py-16 md:py-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-gradient-to-r from-[#8B4513]/10 to-transparent blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-gradient-to-l from-[#8B4513]/10 to-transparent blur-3xl" />

        {/* Mobile-specific decorative elements */}
        <div className="from-[#8B4513]/8 absolute left-4 top-32 h-24 w-24 rounded-full bg-gradient-to-br to-transparent blur-2xl md:hidden" />
        <div className="from-[#8B4513]/6 absolute bottom-32 right-6 h-20 w-20 rounded-full bg-gradient-to-tl to-transparent blur-xl md:hidden" />
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-15 md:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #8B4513 1px, transparent 0)",
          backgroundSize: "25px 25px",
        }}
      />

      {/* Floating sector icons - responsive */}
      <motion.div
        className="absolute left-8 top-24 hidden md:left-16 md:top-32 lg:block"
        animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm md:h-12 md:w-12">
          <Sprout className="h-5 w-5 text-[#4CAF50] md:h-6 md:w-6" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-32 hidden md:right-20 md:top-40 lg:block"
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 shadow-md backdrop-blur-sm md:h-10 md:w-10">
          <Monitor className="h-4 w-4 text-[#2196F3] md:h-5 md:w-5" />
        </div>
      </motion.div>

      {/* Mobile floating element with sector icon */}
      <motion.div
        className="absolute left-6 top-20 block md:hidden"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 shadow-md backdrop-blur-sm">
          <Candy className="h-4 w-4 text-[#8B4513]" />
        </div>
      </motion.div>

      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col items-center justify-between px-4 text-center sm:px-6 md:flex-row md:px-8 md:text-left"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Left Column: Text and Button */}
        <div className="max-w-lg space-y-6 md:space-y-8">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm sm:px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#8B4513]" />
            <span className="text-xs font-semibold text-[#8B4513] sm:text-sm">
              Start Your Journey
            </span>
          </motion.div>

          <motion.h2
            className="bg-gradient-to-r from-[#8B4513] via-[#8B4513] to-[#6d3610] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Ready to Explore Iloilo&apos;s MSMEs?
          </motion.h2>

          <motion.p
            className="text-base leading-relaxed text-neutral-600 sm:text-lg md:text-xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover the businesses driving our economy and connect with local
            entrepreneurs today! Join thousands who have already found their
            perfect business partners.
          </motion.p>

          {/* Stats - Mobile optimized */}
          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-6 md:justify-start md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div className="text-xl font-bold text-[#8B4513] sm:text-2xl">
                {totalMSMEs}+
              </div>
              <div className="text-xs text-neutral-500 sm:text-sm">
                Businesses
              </div>
            </div>
            <div className="h-6 w-px bg-neutral-300 sm:h-8" />
            <div className="text-center">
              <div className="text-xl font-bold text-[#8B4513] sm:text-2xl">
                24/7
              </div>
              <div className="text-xs text-neutral-500 sm:text-sm">Access</div>
            </div>
            <div className="h-6 w-px bg-neutral-300 sm:h-8" />
            <div className="text-center">
              <div className="text-xl font-bold text-[#8B4513] sm:text-2xl">
                Free
              </div>
              <div className="text-xs text-neutral-500 sm:text-sm">
                Platform
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#8B4513] to-[#6d3610] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#8B4513]/25 sm:px-8 sm:py-4 md:w-auto"
              onClick={() => router.push("/guest")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                Search Directory Now
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6d3610] to-[#8B4513] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.button>

            <motion.button
              className="group w-full rounded-full border-2 border-[#8B4513]/30 bg-white/50 px-6 py-3 font-semibold text-[#8B4513] backdrop-blur-sm transition-all duration-300 hover:border-[#8B4513] hover:bg-[#8B4513]/5 hover:shadow-lg sm:px-8 sm:py-4 md:w-auto"
              onClick={() => {
                const element = document.getElementById("data-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm sm:text-base">View Statistics</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column: Enhanced Image - Mobile optimized */}
        <motion.div
          className="relative mt-10 w-full sm:mt-12 md:mt-0 md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B4513]/20 to-[#8B4513]/10 blur-2xl sm:rounded-3xl" />

          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-hidden rounded-2xl bg-white/20 p-3 backdrop-blur-sm sm:rounded-3xl sm:p-4">
              <Image
                src="/explore.png"
                alt="Explore MSMEs"
                width={500}
                height={500}
                className="h-auto w-full rounded-xl object-cover shadow-2xl sm:rounded-2xl"
              />
            </div>
          </motion.div>

          {/* Floating badge - Mobile responsive */}
          <motion.div
            className="absolute -bottom-3 -left-3 rounded-xl bg-white p-3 shadow-xl sm:-bottom-4 sm:-left-4 sm:rounded-2xl sm:p-4"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B4513]/10 sm:h-10 sm:w-10">
                <FiUsers className="h-4 w-4 text-[#8B4513] sm:h-5 sm:w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#8B4513] sm:text-sm">
                  Search now
                </div>
                <div className="text-xs text-neutral-500">It&apos;s Free!</div>
              </div>
            </div>
          </motion.div>

          {/* Mobile-specific trust badge */}
          <motion.div
            className="absolute -right-2 -top-2 rounded-full bg-green-500 p-2 shadow-lg md:hidden"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.8 },
              scale: { duration: 0.5, delay: 0.8 },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            viewport={{ once: true }}
          >
            <FiUsers className="h-3 w-3 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

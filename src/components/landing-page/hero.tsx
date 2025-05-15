"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi"; // Corrected import for FiArrowRight

export default function Hero() {
  const router = useRouter();

  return (
    <section className="-mt-6 w-full bg-[#f9f8f4] pb-4 md:pb-2">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-[#8B4513]/10" />
        <div className="absolute -right-20 top-1/2 h-40 w-40 rounded-full bg-[#8B4513]/5" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 md:flex-row md:gap-8 md:px-6">
        {/* Image Section */}
        <motion.div
          className="relative -mt-6 mb-0 flex w-full justify-center md:w-3/5 md:justify-start"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="w-[85%] md:w-full"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1.03 }}
            whileHover={{ scale: 1.06 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <Image
              src="/landing-bg.png"
              alt="Iloilo cultural and architectural highlights"
              width={800}
              height={800}
              className="h-auto w-full object-contain drop-shadow-xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="-mt-2 w-full space-y-3 px-4 text-center md:-mt-8 md:w-2/5 md:px-0 md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-block rounded-full bg-[#8B4513]/10 px-4 py-1">
            <span className="text-sm font-medium text-[#8B4513]">
              Iloilo&apos;s Premier MSME Platform
            </span>
          </div>

          <motion.h2
            className="text-3xl font-bold leading-tight text-[#8B4513] md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover, Connect, and Support Iloilo&apos;s MSMEs.
          </motion.h2>

          <motion.p
            className="mx-auto max-w-md text-lg text-neutral-700 md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Discover and support local enterprises that drive Iloilo&apos;s
            economy. Explore the MSME directory to find businesses, learn their
            stories, and see their impact.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 pt-2 md:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button
              className="mx-auto block rounded-full border-2 border-[#8B4513] bg-[#8B4513] px-8 py-2.5 font-medium text-white transition hover:bg-[#8B4513]/10 hover:text-[#8B4513] md:mx-0 md:inline-block"
              onClick={() => router.push("/guest")}
            >
              Search Directory Now
            </button>

            <motion.button
              className="flex items-center justify-center gap-2 rounded-full border-2 border-[#8B4513] px-6 py-3 font-medium text-[#8B4513] transition hover:bg-[#8B4513]/10"
              onClick={() => {
                const element = document.getElementById("data-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Learn More
              <FiArrowRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

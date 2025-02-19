"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <section className="-mt-20 bg-[#f9f8f4] py-10">
      {/* Supporting Local Section */}
      <motion.div
        className="mx-auto flex max-w-6xl items-center justify-between px-3"
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Image moved to the left */}
        <motion.div
          className="w-1/2"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <img
            src="landing-bg.png"
            alt="landing-bg"
            className="h-auto w-full rounded-lg"
          />
        </motion.div>

        {/* Text Content */}
        <div className="w-1/2 space-y-6 pl-10">
          <motion.h2
            className="text-3xl font-bold text-[#8B4513]"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
          >
            Discover, Connect, and Support Local MSMEs
          </motion.h2>

          <motion.p
            className="text-base text-neutral-700"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false }}
          >
            Discover and support local enterprises that drive Iloilo’s economy.
            Explore the MSME directory to find businesses, learn their stories,
            and see their impact.
          </motion.p>

          <motion.button
            className="rounded-xl border-2 border-[#8B4513] px-6 py-2 text-[#8B4513] transition hover:bg-[#8B4513] hover:text-white"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false }}
            onClick={() => router.push("/guest")}
          >
            Search Directory Now
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

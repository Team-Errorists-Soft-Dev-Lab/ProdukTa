"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();
  return (
    <section className="-py-4 mx-auto flex max-w-5xl flex-col items-center justify-between bg-[#f9f8f4] px-3 md:flex-row">
      {/* Supporting Local Section */}
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 md:grid-cols-2 md:items-center"
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Image Section (Always on Top in Small Screens) */}
        <motion.div
          className="order-1 h-auto w-full"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ scale: 1.25, x: 0, opacity: 1 }}
          whileHover={{ scale: 1.3 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/landing-bg.png"
            alt="landing-bg"
            className="w-full rounded-lg"
            layout="responsive"
            width={1000}
            height={950}
          />
        </motion.div>

        {/* Text Content (Below Image in Small Screens) */}
        <div className="order-2 w-full space-y-4 text-center md:text-left">
          <motion.h2
            className="text-3xl font-bold text-[#8B4513]"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Discover and Support Local MSMEs
          </motion.h2>

          <motion.p
            className="text-base text-neutral-700"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
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
            viewport={{ once: true }}
            onClick={() => router.push("/guest")}
          >
            Search Directory Now
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

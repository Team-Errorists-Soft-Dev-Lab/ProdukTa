"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="-mt-20 bg-muted/50 py-20 pb-1">
      <motion.div
        className="mx-auto flex max-w-6xl items-center justify-between px-3"
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Left Column: Text and Button */}
        <div className="max-w-lg space-y-6">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
          >
            Ready to Explore Iloilo&apos;s MSMEs?
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false }}
          >
            Discover the businesses driving our economy and connect with local
            entrepreneurs today!
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

        {/* Right Column: Image */}
        <motion.div
          className="w-1/2"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <img
            src="explore.png"
            alt="Explore MSMEs"
            className="h-auto w-full rounded-lg"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

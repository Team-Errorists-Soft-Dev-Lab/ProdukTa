"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="-mt-20 bg-muted/50 py-20 pb-1">
      <motion.div
        className="mx-auto flex max-w-6xl flex-col items-center justify-between px-3 text-center md:flex-row md:text-left"
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
            viewport={{ once: true }}
          >
            Ready to Explore Iloilo&apos;s MSMEs?
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
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
          className="mt-8 w-full md:mt-0 md:w-1/2"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <Image
            src="/explore.png"
            alt="Explore MSMEs"
            width={500}
            height={500}
            className="h-auto w-full max-w-md rounded-lg md:max-w-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

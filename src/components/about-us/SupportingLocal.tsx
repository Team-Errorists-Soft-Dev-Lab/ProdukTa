"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const SupportingLocal = () => {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center justify-between bg-[#f9f8f4] px-3 py-10">
      {/* Content Wrapper */}
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 md:grid-cols-2 md:items-center"
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Text Content (Left Side on Desktop, Top on Mobile) */}
        <div className="w-full space-y-4 text-center md:text-left">
          <motion.h2
            className="text-3xl font-bold text-[#8B4513]"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Get To Know ProdukTa
          </motion.h2>

          <motion.p
            className="text-base text-neutral-700"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            ProdukTa is a digital directory that enhances MSME visibility in
            Iloilo. Developed by DTI and CPU’s Software Engineering Department,
            it connects communities to local businesses in one accessible
            platform.
          </motion.p>

          <motion.button
            className="rounded-xl border-2 border-[#8B4513] px-6 py-2 text-[#8B4513] transition hover:bg-[#8B4513] hover:text-white"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            onClick={() => {
              const element = document.getElementById("about-us");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Learn More
          </motion.button>
        </div>

        {/* Image Section (Right Side on Desktop, Bottom on Mobile) */}
        <motion.div
          className="h-auto w-full"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ scale: 1.1, x: 0, opacity: 1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/bg-1.png"
            alt="Supporting Local"
            className="w-full rounded-lg"
            layout="responsive"
            width={1000}
            height={950}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SupportingLocal;

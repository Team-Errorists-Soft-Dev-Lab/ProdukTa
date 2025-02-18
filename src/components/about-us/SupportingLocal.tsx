"use client";

import { motion } from "framer-motion";

const SupportingLocal = () => {
  return (
    <motion.div
      className="mx-auto -mt-10 flex max-w-4xl flex-col items-center justify-between bg-[#f9f8f4] px-3 py-10 md:flex-row"
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Supporting Local Content */}
      <div className="w-full space-y-6 md:w-1/2">
        <motion.h2
          className="text-3xl font-bold text-[#8B4513]"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          Get To Know ProdukTa
        </motion.h2>

        <motion.p
          className="text-base text-neutral-700"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: false }}
        >
          ProdukTa is a digital directory that enhances MSME visibility in
          Iloilo. Developed by DTI and CPU’s Software Engineering Department, it
          connects communities to local businesses in one accessible platform.
        </motion.p>

        <motion.button
          className="rounded-xl border-2 border-[#8B4513] px-6 py-2 text-[#8B4513] transition hover:bg-[#8B4513] hover:text-white"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: false }}
          onClick={() => {
            const element = document.getElementById("our-story"); // ID should match the one in the OurStory component
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Learn More
        </motion.button>
      </div>

      {/* Supporting Local Image Section */}
      <motion.div
        className="relative grid h-[30rem] w-full grid-cols-1 items-center gap-6 bg-cover bg-center md:w-1/2 md:grid-cols-2"
        style={{ backgroundImage: "url('/bg-1.png')" }}
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        viewport={{ once: false }}
      ></motion.div>
    </motion.div>
  );
};

export default SupportingLocal;

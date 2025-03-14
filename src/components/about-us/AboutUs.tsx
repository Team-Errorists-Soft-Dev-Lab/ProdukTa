"use client";

import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <motion.div
      id="about-us"
      className="-mt-18 mx-auto max-w-5xl px-6 py-10"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="-mt-3 mb-4 text-left text-3xl font-bold text-[#8B4513]"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        About Us
      </motion.h2>

      <div className="flex items-stretch gap-8">
        {["Our Platform", "Our Mission"].map((title, idx) => (
          <motion.div
            key={idx}
            className="-mt-6 flex w-1/2 flex-col bg-white p-6"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            <motion.img
              src={idx === 0 ? "/platform.png" : "/mission.png"}
              alt={title}
              className="mx-auto mb-4 w-3/4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            />
            <motion.h3
              className="text-xl font-semibold text-[#8B4513]"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: idx * 0.15,
              }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="mt-2 flex-grow text-base text-neutral-700"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: idx * 0.2,
              }}
              viewport={{ once: true }}
            >
              {idx === 0
                ? "Produkta is a digital directory that connects MSMEs with consumers. Businesses can register, showcase their services, and boost visibility, while users easily discover local enterprises by sector and location."
                : "To empower MSMEs in Iloilo by enhancing visibility, connecting communities, and fostering local economic growth through a centralized digital directory."}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutUs;

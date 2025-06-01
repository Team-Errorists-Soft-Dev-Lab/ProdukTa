"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { Coffee, Sprout, Monitor, Utensils } from "lucide-react";

const AboutProdukta = () => {
  // Animation variants for reusability and consistency
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] pb-12 pt-12 md:pb-16 md:pt-16">
      {/* Enhanced decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-r from-[#8B4513]/20 to-[#8B4513]/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-48 w-48 rounded-full bg-gradient-to-l from-[#8B4513]/15 to-transparent blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#8B4513]/5 to-transparent blur-xl" />

        {/* Mobile-friendly smaller decorative elements */}
        <div className="absolute right-4 top-20 h-20 w-20 rounded-full bg-gradient-to-br from-[#8B4513]/10 to-transparent blur-xl md:hidden" />
        <div className="from-[#8B4513]/8 absolute bottom-20 left-4 h-16 w-16 rounded-full bg-gradient-to-tr to-transparent blur-lg md:hidden" />
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-15 md:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #8B4513 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

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
          <Monitor className="h-5 w-5 text-[#2196F3]" />
        </div>
      </motion.div>

      {/* Mobile floating elements */}
      <motion.div
        className="absolute right-6 top-16 block lg:hidden"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-md backdrop-blur-sm">
          <Utensils className="h-4 w-4 text-[#FF8C00]" />
        </div>
      </motion.div>

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div
          className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Text Content */}
          <motion.div
            className="flex flex-col items-center space-y-6 text-center lg:items-start lg:text-left"
            variants={itemVariants}
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
                Digital Directory Platform
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
              Get To Know{" "}
              <span className="relative">
                ProdukTa
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
              className="mx-auto max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg md:mx-0 md:text-xl lg:max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              ProdukTa is a digital directory that enhances MSME visibility in
              Iloilo. Developed by DTI and CPU&apos;s Software Engineering
              Department, it connects communities to local businesses in one
              accessible platform.
            </motion.p>

            {/* Action Button */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#8B4513] to-[#6d3610] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#8B4513]/25 sm:px-8 sm:py-3.5"
                onClick={() => {
                  const element = document.getElementById("about-us");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                  Learn More
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#6d3610] to-[#8B4513] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto h-full min-h-[400px] w-full sm:min-h-[500px] lg:min-h-[600px]"
          >
            {/* Glow effect behind image */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B4513]/20 to-[#8B4513]/10 blur-2xl" />

            <motion.div
              className="relative h-full w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/bg-1.png"
                alt="ProdukTa - Supporting Local Businesses"
                fill
                sizes="(max-width: 850px) 100vw, 50vw"
                className="relative rounded-2xl object-cover drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutProdukta;

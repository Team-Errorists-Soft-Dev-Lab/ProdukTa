"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
    <section className="relative flex h-screen w-full items-center overflow-hidden bg-[#f9f8f4] pb-6">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-[#8B4513]/10" />
        <div className="absolute -right-20 top-1/2 h-40 w-40 rounded-full bg-[#8B4513]/5" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Text Content - Center on mobile, left on desktop */}
          <motion.div
            className="flex flex-col items-center space-y-6 text-center lg:items-start lg:text-left"
            variants={itemVariants}
          >
            <div className="mb-2 inline-block rounded-full bg-[#8B4513]/10 px-3 py-1 text-sm font-medium text-[#8B4513]">
              Digital Directory
            </div>

            <h2 className="text-3xl font-bold leading-tight text-[#8B4513] md:text-4xl">
              Get To Know ProdukTa
            </h2>

            <p className="mx-auto max-w-md text-base leading-relaxed text-neutral-700 md:text-lg lg:mx-0">
              ProdukTa is a digital directory that enhances MSME visibility in
              Iloilo. Developed by DTI and CPU&#39;s Software Engineering
              Department, it connects communities to local businesses in one
              accessible platform.
            </p>

            <motion.button
              className="group flex items-center gap-2 rounded-lg bg-[#8B4513] px-6 py-3 font-medium text-white transition-all hover:bg-[#8B4513]/90"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const element = document.getElementById("about-us");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Learn More
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Image - Centered on all screens */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="relative mx-auto h-full min-h-[500px] w-full lg:min-h-[600px]"
          >
            <Image
              src="/bg-1.png"
              alt="ProdukTa - Supporting Local Businesses"
              fill
              sizes="(max-width: 850px) 100vw, 50vw"
              className="rounded-lg object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutProdukta;

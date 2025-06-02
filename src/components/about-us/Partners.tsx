"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiX, FiUsers, FiHeart } from "react-icons/fi";
import { Building, Handshake } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

const Partners = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] py-16 md:py-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-gradient-to-r from-[#8B4513]/10 to-transparent blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-gradient-to-l from-[#8B4513]/10 to-transparent blur-3xl" />
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-15 md:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #8B4513 1px, transparent 0)",
          backgroundSize: "25px 25px",
        }}
      />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute left-8 top-24 hidden md:left-16 md:top-32 lg:block"
        animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm md:h-12 md:w-12">
          <Building className="h-5 w-5 text-[#8B4513] md:h-6 md:w-6" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-32 hidden md:right-20 md:top-40 lg:block"
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 shadow-md backdrop-blur-sm md:h-10 md:w-10">
          <Handshake className="h-4 w-4 text-[#4CAF50] md:h-5 md:w-5" />
        </div>
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="mb-4 bg-gradient-to-r from-[#8B4513] via-[#8B4513] to-[#6d3610] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Partnership & Collaboration
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-neutral-600 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Building bridges between institutions to empower local businesses
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          {/* Left Column - Text & Logos */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-sm md:p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8B4513]/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />

            <div className="relative z-10 space-y-6">
              <motion.p
                className="text-sm leading-relaxed text-neutral-600 sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                viewport={{ once: true }}
              >
                ProdukTa is a collaboration between DTI Iloilo and the Software
                Engineering Department of Central Philippine University College
                of Engineering, reflecting a shared commitment to empowering
                local businesses through digital transformation.
              </motion.p>

              <motion.p
                className="text-sm font-medium text-[#8B4513] sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Together, we can turn ideas into reality.
              </motion.p>

              {/* Developers Button */}
              <motion.button
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B4513] to-[#6d3610] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#8B4513]/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPopupOpen(true)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <FiUsers className="h-4 w-4" />
                <span className="text-sm sm:text-base">
                  Meet Our Developers
                </span>
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              {/* Partner Logos */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="text-sm font-semibold text-[#8B4513] sm:text-base">
                  Our Partners
                </h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    {
                      logo: "DTI_logo.png",
                      url: "https://www.facebook.com/DTI.Iloilo",
                    },
                    { logo: "cpu-logo.png", url: "https://cpu.edu.ph/" },
                    {
                      logo: "eng-logo.png",
                      url: "https://www.facebook.com/cpucoengg/",
                    },
                    {
                      logo: "se-logo.png",
                      url: "https://www.facebook.com/people/CPU-Software-Engineering/61556019514302/",
                    },
                  ].map((partner, index) => (
                    <motion.a
                      key={index}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-xl bg-white/50 p-3 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <Image
                        src={`/${partner.logo}`}
                        width={60}
                        height={60}
                        alt="Partner Logo"
                        className="h-auto w-full max-w-[60px] object-contain"
                      />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Image Carousel */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-4 shadow-xl backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B4513]/10 to-[#8B4513]/5 blur-xl" />

            <div className="relative z-10">
              <ImageCarousel />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-h-[90vh] w-[90%] overflow-y-auto rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:w-[85%] sm:p-8 md:w-[70%] md:max-w-[600px] md:p-10 lg:max-w-[700px]"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Close Button */}
              <motion.button
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-500 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-800 hover:shadow-xl"
                onClick={() => setIsPopupOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </motion.button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  className="mb-6 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8B4513] to-[#6d3610] shadow-lg">
                    <FiHeart className="h-8 w-8 text-white" />
                  </div>
                </motion.div>

                <motion.h1
                  className="mb-6 bg-gradient-to-r from-[#8B4513] to-[#6d3610] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Thanks to our developers!
                </motion.h1>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    "Aaron Ciervo",
                    "Manaf Kassim",
                    "Matthew Ledesma",
                    "Jezerwel Griño",
                    "Faith Nina Marie Magsael",
                  ].map((name, index) => (
                    <motion.p
                      key={name}
                      className="text-base font-semibold text-neutral-700 sm:text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {name}
                    </motion.p>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Partners;

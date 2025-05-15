"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

const Partners = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center gap-12 px-8 py-16 md:px-16 lg:flex-row lg:gap-16 lg:px-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      viewport={{ once: true }}
    >
      {/* Left Column - Text & Logos */}
      <motion.div
        className="text-left lg:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="mb-6 text-3xl font-bold text-[#8B4513]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          Partnership & Collaboration
        </motion.h2>
        <motion.p
          className="text-base text-neutral-700"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Produkta is a collaboration between DTI Iloilo and the Software
          Engineering Department of Central Philippine University College of
          Engineering, reflecting a shared commitment to empowering local
          businesses through digital transformation.
        </motion.p>

        <motion.p
          className="mt-4 text-base text-neutral-700"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Together, we can turn ideas into reality.
        </motion.p>

        {/* Developers Button */}
        <motion.button
          className="mt-4 flex items-center font-semibold text-[#8B4513] hover:underline"
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsPopupOpen(true)}
        >
          <ArrowRight className="mr-2" size={20} /> Our Developers
        </motion.button>

        {/* Partner Logos */}
        <motion.div
          className="mt-6 flex flex-wrap gap-4"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {["DTI_logo.png", "cpu-logo.png", "eng-logo.png", "se-logo.png"].map(
            (logo, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.4 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={`/${logo}`}
                  width={100}
                  height={100}
                  alt="Partner Logo"
                />
              </motion.div>
            ),
          )}
        </motion.div>
      </motion.div>

      {/* Right Column - Image Carousel */}
      <motion.div
        className="lg:ml-12 lg:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        viewport={{ once: true }}
      >
        <ImageCarousel />
      </motion.div>

      {/* Popup Modal with AnimatePresence for proper animation handling */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-h-[90vh] w-[90%] overflow-y-auto rounded-xl bg-white p-6 text-center shadow-2xl sm:w-[85%] sm:p-8 md:w-[70%] md:max-w-[600px] md:p-10 lg:max-w-[700px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <button
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 sm:right-4 sm:top-4"
                onClick={() => setIsPopupOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <h1 className="mb-6 mt-2 text-2xl font-semibold text-[#8B4513] sm:text-3xl md:text-4xl">
                Thanks to our developers!
              </h1>
              <div className="mt-6 text-base text-neutral-700">
                <p className="text-base font-semibold">Developers:</p>
                <p className="text-base">Aaron Ciervo</p>
                <p className="text-base">Manaf Kassim</p>
                <p className="text-base">Matthew Ledesma</p>
                <p className="mt-6 text-base font-semibold">Scrum Master:</p>
                <p className="text-base">Jezrewel Grino</p>
                <p className="mt-6 text-base font-semibold">Product Owner:</p>
                <p className="text-base">Faith Nina Marie Magsael</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Partners;

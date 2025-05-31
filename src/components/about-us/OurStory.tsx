"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Heart } from "lucide-react";

export default function OurStory() {
  const [bgColor, setBgColor] = useState("#f9f8f4");
  const swiperRef = useRef<SwiperInstance | null>(null);

  const slides = [
    {
      image: "/map.png",
      color: "#f9f8f4",
      subheading: "Our Story",
      text: "Produkta was created to support and promote Iloilo's local businesses. It serves as a digital bridge between buyers and Micro, Small, and Medium Enterprises (MSMEs), offering a centralized platform to explore, connect with, and support homegrown businesses.",
    },
    {
      image: "/name2.png",
      color: "#e8e1ce",
      subheading: "What's in the Name?",
      text: `Produkta comes from the Hiligaynon phrase "Produkto Ta," meaning "Our Products." 
             This name reflects the app's mission to showcase Iloilo's locally made goods and empower MSMEs. 
             As a digital directory, Produkta connects businesses with buyers, fostering local pride and economic growth.`,
    },
    {
      image: "/words.png",
      color: "#f9f8f4",
      subheading: "More Than Just Words",
      text: `"Everything Local, in One Place." — this tagline embodies Produkta's commitment to uniting Iloilo's local businesses 
             within a single, accessible platform. It highlights our dedication to supporting MSMEs and making it easier for customers 
             to discover and connect with homegrown enterprises.`,
    },
    {
      image: "/logo-produkta.png",
      color: "#e5ddcd",
      subheading: "Every Detail Matters",
      text: `The Produkta logo captures Iloilo's rich culture and thriving local economy. The bamboo frame symbolizes strength and sustainability, 
             while the woven basket represents craftsmanship and tradition. At its center, a collection of local products showcases the diversity 
             of MSMEs, reinforcing the app's mission to support and promote homegrown businesses.`,
    },
  ];

  return (
    <section
      id="our-story"
      className="relative overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] py-16 md:py-20"
    >
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
          <BookOpen className="h-5 w-5 text-[#8B4513] md:h-6 md:w-6" />
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
          <Heart className="h-4 w-4 text-[#FF0000] md:h-5 md:w-5" />
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
            Our Story
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-neutral-600 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Discover the journey behind ProdukTa and what makes us unique
          </motion.p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-sm md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) =>
                setBgColor(slides[swiper.activeIndex]?.color || bgColor)
              }
              className="swiper-custom relative"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Image Section */}
                    <motion.div
                      className="relative order-2 md:order-1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B4513]/10 to-[#8B4513]/5 blur-xl" />
                      <Image
                        src={slide.image}
                        width={500}
                        height={500}
                        alt={slide.subheading}
                        className="relative rounded-2xl drop-shadow-lg"
                      />
                    </motion.div>

                    {/* Text Section */}
                    <motion.div
                      className="relative order-1 space-y-4 md:order-2"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <motion.h3
                        className="bg-gradient-to-r from-[#8B4513] to-[#6d3610] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {slide.subheading}
                      </motion.h3>

                      <motion.p
                        className="text-sm leading-relaxed text-neutral-600 sm:text-base"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        {slide.text}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Custom Navigation Buttons */}
          <motion.button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl md:-left-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <ChevronLeft className="h-6 w-6 text-[#8B4513]" />
          </motion.button>

          <motion.button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl md:-right-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <ChevronRight className="h-6 w-6 text-[#8B4513]" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

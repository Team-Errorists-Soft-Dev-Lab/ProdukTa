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

export default function OurStory() {
  const [bgColor, setBgColor] = useState("#f9f8f4");
  const swiperRef = useRef<SwiperInstance | null>(null);

  const slides = [
    {
      image: "/map.png",
      color: "#f9f8f4",
      subheading: "Our Story",
      text: "Produkta was created to support and promote Iloilo’s local businesses. It serves as a digital bridge between consumers and Micro, Small, and Medium Enterprises (MSMEs), offering a centralized platform to explore, connect with, and support homegrown businesses.",
    },
    {
      image: "/name2.png",
      color: "#e8e1ce",
      subheading: "What's in the Name?",
      text: `Produkta comes from the Hiligaynon phrase "Produkto Ta," meaning "Our Products." 
             This name reflects the app’s mission to showcase Iloilo’s locally made goods and empower MSMEs. 
             As a digital directory, Produkta connects businesses with consumers, fostering local pride and economic growth.`,
    },
    {
      image: "/words.png",
      color: "#f9f8f4",
      subheading: "More Than Just Words",
      text: `"Everything Local, in One Place." — this tagline embodies Produkta’s commitment to uniting Iloilo’s local businesses 
             within a single, accessible platform. It highlights our dedication to supporting MSMEs and making it easier for consumers 
             to discover and connect with homegrown enterprises.`,
    },
    {
      image: "/logo-produkta.png",
      color: "#e5ddcd",
      subheading: "Every Detail Matters",
      text: `The Produkta logo captures Iloilo’s rich culture and thriving local economy. The bamboo frame symbolizes strength and sustainability, 
             while the woven basket represents craftsmanship and tradition. At its center, a collection of local products showcases the diversity 
             of MSMEs, reinforcing the app’s mission to support and promote homegrown businesses.`,
    },
  ];

  return (
    <div id="our-story" className="relative -mt-12 py-16">
      <div className="relative mx-auto max-w-5xl px-8">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) =>
            setBgColor(slides[swiper.activeIndex]?.color || bgColor)
          }
          className="swiper-custom relative"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-2"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={slide.image}
                    width={500}
                    height={500}
                    alt={slide.subheading}
                    className="rounded-lg"
                  />
                </motion.div>
                <motion.div
                  className="relative z-10 rounded-lg bg-transparent bg-opacity-80 p-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.h2
                    className="text-3xl font-semibold text-[#8B4513]"
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {slide.subheading}
                  </motion.h2>
                  <motion.p
                    className="text-l mt-2 text-gray-600"
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
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
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 h-9 w-9 -translate-x-12 -translate-y-1/2 text-[#996439]"
        >
          ❮
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 h-9 w-9 -translate-y-1/2 translate-x-12 text-[#996439]"
        >
          ❯
        </button>
      </div>
    </div>
  );
}

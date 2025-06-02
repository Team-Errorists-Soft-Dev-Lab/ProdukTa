"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

export default function ImageCarousel() {
  const slides = [
    { src: "/team.jpg", alt: "Development Team" },
    { src: "/team-1.jpg", alt: "Team Meeting" },
    { src: "/team-2.jpg", alt: "Technical Discussion" },
    { src: "/team-3.jpg", alt: "Team Presentation" },
    { src: "/team-4.jpg", alt: "Team Achievement" },
  ];

  return (
    <div className="flex w-full max-w-[95%] justify-center px-2 md:max-w-full md:px-0">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full max-w-2xl rounded-xl shadow-lg"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl">
              <Image
                src={slide.src}
                width={800}
                height={500}
                alt={slide.alt}
                className="h-full w-full object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

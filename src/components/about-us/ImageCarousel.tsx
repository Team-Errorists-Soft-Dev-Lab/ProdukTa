"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

export default function ImageCarousel() {
  return (
    <div className="flex w-full max-w-[90%] justify-center px-4 md:max-w-full md:px-0">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000 }}
        loop
        className="w-full max-w-lg rounded-lg shadow-lg"
      >
        <SwiperSlide>
          <Image
            src="/image-1.jpg"
            width={800}
            height={400}
            alt="Slide 1"
            className="w-full rounded-lg object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/image-2.jpg"
            width={800}
            height={400}
            alt="Slide 2"
            className="w-full rounded-lg object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/image-3.jpg"
            width={800}
            height={400}
            alt="Slide 2"
            className="w-full rounded-lg object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/image-4.jpg"
            width={800}
            height={400}
            alt="Slide 2"
            className="w-full rounded-lg object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

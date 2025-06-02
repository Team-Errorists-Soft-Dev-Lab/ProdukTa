"use client";
import { motion } from "framer-motion";
import { Target, Zap, Building2, Lightbulb } from "lucide-react";

const AboutUs = () => {
  return (
    <section
      id="about-us"
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
          <Building2 className="h-5 w-5 text-[#8B4513] md:h-6 md:w-6" />
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
          <Lightbulb className="h-4 w-4 text-[#FF8C00] md:h-5 md:w-5" />
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
            About Us
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-neutral-600 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Learn more about our platform and mission to empower Iloilo&apos;s
            MSME community
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              title: "Our Platform",
              icon: Zap,
              image: "/platform.png",
              description:
                "ProdukTa is a digital directory that connects MSMEs with buyers. Businesses can showcase their services and crafts to boost visibility, while users easily discover local enterprises by sector and location.",
            },
            {
              title: "Our Mission",
              icon: Target,
              image: "/mission.png",
              description:
                "To empower MSMEs in Iloilo by enhancing visibility, connecting communities, and fostering local economic growth through a centralized digital directory.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/80 hover:shadow-2xl md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                delay: idx * 0.2,
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8B4513]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B4513] to-[#6d3610] shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Image */}
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="mb-6 h-48 w-full rounded-xl object-contain drop-shadow-lg sm:h-56"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                />

                {/* Title */}
                <motion.h3
                  className="mb-4 text-xl font-semibold text-[#8B4513] sm:text-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: idx * 0.15,
                  }}
                  viewport={{ once: true }}
                >
                  {item.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="text-sm leading-relaxed text-neutral-600 sm:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: idx * 0.2,
                  }}
                  viewport={{ once: true }}
                >
                  {item.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

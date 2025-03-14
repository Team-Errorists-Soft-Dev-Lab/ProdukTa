"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  UsersRound,
  Candy,
  Coffee,
  Sprout,
  Shirt,
  Monitor,
  Utensils,
  Palmtree,
} from "lucide-react";
import { SECTOR_COLORS } from "@/lib/sector-colors";

const MSMEPerSector = [
  { name: "Bamboo", value: 295, icon: Sprout, color: SECTOR_COLORS.Bamboo },
  { name: "Coffee", value: 245, icon: Coffee, color: SECTOR_COLORS.Coffee },
  { name: "Cacao", value: 215, icon: Candy, color: SECTOR_COLORS.Cacao },
  {
    name: "High Value Coco Product",
    value: 205,
    icon: Palmtree,
    color: SECTOR_COLORS.Coconut,
  },
  {
    name: "Homestyles and Wearables",
    value: 195,
    icon: Shirt,
    color: SECTOR_COLORS["Wearables and Homestyles"],
  },
  {
    name: "Processed Foods",
    value: 130,
    icon: Utensils,
    color: SECTOR_COLORS["Processed Foods"],
  },
  {
    name: "IT-BPM",
    value: 85,
    icon: Monitor,
    color: SECTOR_COLORS["IT - BPM"],
  },
];

const totalMSMEs = MSMEPerSector.reduce((sum, sector) => sum + sector.value, 0);

function RollingNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      setCount(0);
      const interval = setInterval(() => {
        setCount((prev) => (prev < value ? prev + 1 : value));
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl font-bold">
      {count}
    </span>
  );
}

export default function DataSection() {
  return (
    <section className="mt-2 flex justify-center bg-[#f9f8f4] py-20 pb-2">
      <div className="w-full max-w-6xl space-y-12 px-6">
        <motion.h2
          className="-mt-8 text-3xl font-bold text-[#8B4513]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          MSME Overview
        </motion.h2>

        <motion.div
          className="rounded-lg bg-white p-6 shadow-md"
          whileHover={{ scale: 1.0 }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3 lg:grid-cols-7">
            {MSMEPerSector.map((sector, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="h-10 w-10" style={{ color: sector.color }}>
                  <sector.icon className="h-full w-full" />
                </div>
                <RollingNumber value={sector.value} />
                <p className="text-sm text-[#120f0c]/80">{sector.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-start justify-center rounded-lg bg-white p-6 shadow-md"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.2 }}>
              <UsersRound className="h-20 w-20 text-[#a17544]" />
            </motion.div>
            <motion.span
              className="text-7xl font-bold text-[#120f0c]"
              whileHover={{ scale: 1.2 }}
            >
              {totalMSMEs}
            </motion.span>
          </div>
          <p className="mt-4 text-xl text-[#120f0c]/80">
            Total registered MSMEs across all sectors
          </p>
        </motion.div>
      </div>
    </section>
  );
}

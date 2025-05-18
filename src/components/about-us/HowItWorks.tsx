import Link from "next/link";
import { Search, Compass, BarChart2, Download } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Search",
    description:
      "Quickly find MSMEs by sector, municipality, or specific keywords using our intuitive search tool.",
    icon: Search,
    link: "/guest",
  },
  {
    title: "Explore",
    description:
      "Dive into detailed profiles of MSMEs, including their products, services, and locations.",
    icon: Compass,
    link: "/guest",
  },
  {
    title: "Analyze",
    description:
      "Gain valuable insights with interactive charts and data, including sector trends and municipal rankings.",
    icon: BarChart2,
    link: "/#data-section",
  },
  {
    title: "Export",
    description:
      "Download organized reports of MSME data for personal or professional use.",
    icon: Download,
    link: "/guest-export",
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-0 bg-[#f9f8f4] py-2">
      <div className="mx-auto max-w-5xl px-3">
        <motion.h2
          className="mb-12 text-3xl font-bold text-[#8B4513]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.link}
                className="group"
                tabIndex={0}
              >
                <motion.div
                  className="flex cursor-pointer flex-col items-start rounded-lg bg-white p-6 text-left shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-[#8B4513]"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#8B4513]"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.15,
                    }}
                    viewport={{ once: true }}
                  >
                    <IconComponent className="h-6 w-6 text-[#ffffff]" />
                  </motion.div>
                  <motion.h3
                    className="mb-2 text-xl font-semibold text-[#8B4513]"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.2,
                    }}
                    viewport={{ once: true }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="text-base text-muted-foreground"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.25,
                    }}
                    viewport={{ once: true }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

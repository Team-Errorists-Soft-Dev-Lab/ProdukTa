import { Search, Compass, BarChart2, Download } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Search",
    description:
      "Quickly find MSMEs by sector, municipality, or specific keywords using our intuitive search tool.",
    icon: Search,
  },
  {
    title: "Explore",
    description:
      "Dive into detailed profiles of MSMEs, including their products, services, and locations.",
    icon: Compass,
  },
  {
    title: "Analyze",
    description:
      "Gain valuable insights with interactive charts and data, including sector trends and municipal rankings.",
    icon: BarChart2,
  },
  {
    title: "Export",
    description:
      "Download organized reports of MSME data for personal or professional use.",
    icon: Download,
  },
];

export default function Features() {
  return (
    <section className="-mt-20 bg-[#f9f8f4] py-16">
      <div className="mx-auto max-w-6xl px-3">
        <motion.h2
          className="mb-12 text-3xl font-bold text-[#8B4513]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: false }}
        >
          How It Works
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col items-start rounded-lg bg-white p-6 text-left shadow-md"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: index * 0.1,
              }}
              viewport={{ once: false }}
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
                viewport={{ once: false }}
              >
                <feature.icon className="h-6 w-6 text-[#ffffff]" />
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
                viewport={{ once: false }}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.25,
                }}
                viewport={{ once: false }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

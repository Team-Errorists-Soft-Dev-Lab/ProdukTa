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
    <section className="bg-[#FBF9F6] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="mb-14 text-left text-4xl font-semibold tracking-tight text-[#8B4513] sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.link}
                className="group block"
                tabIndex={0}
              >
                <motion.div
                  className="flex h-full cursor-pointer flex-col items-start rounded-xl bg-white p-6 text-left shadow-lg transition-shadow duration-300 ease-in-out group-hover:shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[#8B4513] p-3">
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-medium text-[#8B4513]">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

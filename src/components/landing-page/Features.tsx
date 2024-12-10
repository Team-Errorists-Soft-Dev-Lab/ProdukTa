import { Search, Compass, BarChart2, Download } from "lucide-react";

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
    <div className="container max-w-full">
      <br />
      <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center p-6 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

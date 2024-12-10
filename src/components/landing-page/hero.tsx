import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden py-10"
      style={{
        backgroundImage: "url('/landing-page-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container relative z-10 flex max-w-full items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-white">
            Empowering MSMEs Across Iloilo
          </h1>
          <p className="mt-6 text-lg font-bold text-muted-foreground text-white">
            Explore the MSME directory and discover their contributions to
            Iloilo's thriving economy.
          </p>
          <Button
            className="mt-8 bg-white"
            size="lg"
            onClick={() => router.push("/guest")}
          >
            <ArrowRight className="ml-2 h-4 w-4 bg-[#8B4513]" />
            <p className="text-[#8B4513]">Search Directory Now</p>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden py-12"
      style={{
        backgroundImage: "url('/landing-page-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        height: "500px",
      }}
    >
      <div className="container relative z-10 flex min-h-[300px] max-w-full flex-col items-center justify-center py-8">
        <div className="max-w-5xl text-center">
          {/* Heading */}
          <h1 className="mb-4 mt-3 whitespace-nowrap text-5xl font-extrabold text-[#ffe900] drop-shadow-lg">
            Empowering MSMEs Across Iloilo
          </h1>

          {/* Subtitle */}
          <p className="mb-4 mt-1 text-center text-[18px] text-white drop-shadow-md">
            Explore the MSME directory and discover their contributions to
            Iloilo's thriving economy.
          </p>

          {/* Search Button */}
          <Button
            className="mt-1 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-[#003DA6] shadow-lg transition duration-300 ease-in-out hover:bg-[#379ae6] focus:ring-2 focus:ring-[#003DA6] focus:ring-offset-2"
            size="lg"
            onClick={() => router.push("/guest")}
          >
            <p className="text-[#0056D2]">Search Directory Now</p>
          </Button>
        </div>
      </div>
    </section>
  );
}

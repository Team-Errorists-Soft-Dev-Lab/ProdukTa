import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-[#8B4513] py-12">
        <h1 className="text-center text-4xl font-bold text-white">
          About ProdukTa
        </h1>
      </div>
      <div className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold text-[#A67C52]">
            MISSION
          </h2>
          <p className="text-center leading-relaxed text-neutral-700">
            Our mission is to connect communities with local Micro, Small, and
            Medium Enterprises (MSMEs), showcasing their invaluable
            contributions to Iloilo's economy. ProdukTa empowers users with
            data-driven insights and provides a platform for MSMEs to thrive,
            fostering sustainable economic growth and collaboration.
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold text-[#A67C52]">
            VISION
          </h2>
          <p className="text-center leading-relaxed text-neutral-700">
            To become Iloilo's leading digital platform for promoting and
            supporting MSMEs, enabling transparency, innovation, and inclusivity
            in the entrepreneurial ecosystem. We aim to expand our reach and
            impact, contributing to the growth of local businesses and the
            communities they serve.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

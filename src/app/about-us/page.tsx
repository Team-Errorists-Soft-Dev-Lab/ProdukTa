"use client";

import SupportingLocal from "@/components/about-us/SupportingLocal";
import HowItWorks from "@/components/about-us/HowItWorks";
import AboutUs from "@/components/about-us/AboutUs";
import OurStory from "@/components/about-us/OurStory";
import Partners from "@/components/about-us/Partners";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0]">
      <Header />
      <main>
        <SupportingLocal />
        <HowItWorks />
        <AboutUs />
        <OurStory />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}

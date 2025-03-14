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
    <div className="min-h-screen bg-white">
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

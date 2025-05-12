import "./globals.css";
import HeroSection from "@/sections/HeroSection";
import FeaturesSection from "@/sections/FeaturesSection";
import AboutSection from "@/sections/AboutSection";
import ContactSection from "@/sections/ContactSection";
import Header from "@/components/Header/Header";
import Footer from "@/sections/FooterSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0b1120] to-[#111827] text-white overflow-hidden">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <FeaturesSection />
        </div>
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

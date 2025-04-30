// HeroSection.jsx
'use client';

import Link from "next/link";

// Translation object
const heroTranslations = {
  title: "Detect Job Scams Instantly",
  subtitle: "Use AI to protect yourself from fake job postings. Just chat with our bot!",
  cta: "Start Chatting",
};

// CSS classes for animations
const blobAnimation = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 7s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
`;

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-indigo-800 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Add the CSS to a style tag */}
      <style dangerouslySetInnerHTML={{ __html: blobAnimation }} />

      {/* Rest of your component */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          {heroTranslations.title}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-8">
          {heroTranslations.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {heroTranslations.cta}
          </Link>
          
          <Link
            href="#features"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-100 bg-blue-900 bg-opacity-60 hover:bg-opacity-80 md:py-4 md:text-lg md:px-10 transition-all duration-200"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Stats section */}
      <div className="relative z-10 mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
        <div>
          <div className="text-3xl font-bold">99%</div>
          <div className="text-blue-200">Accuracy</div>
        </div>
        <div>
          <div className="text-3xl font-bold">10K+</div>
          <div className="text-blue-200">Jobs Analyzed</div>
        </div>
        <div>
          <div className="text-3xl font-bold">24/7</div>
          <div className="text-blue-200">Protection</div>
        </div>
        <div>
          <div className="text-3xl font-bold">0</div>
          <div className="text-blue-200">Data Stored</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
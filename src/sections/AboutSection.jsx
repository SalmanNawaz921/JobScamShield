'use client';

import Logo from "@/assets/Logo";

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/40 to-indigo-800/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
            About Our Mission
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-blue-100/80">
            We're revolutionizing job search safety with cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-3">Our Story</h3>
              <p className="text-blue-100/80">
                Founded in 2023, Job Scam Shield was born from personal experience with job scams. 
                Our team of AI experts and cybersecurity professionals came together to create 
                a solution that protects job seekers worldwide.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-3">The Technology</h3>
              <p className="text-blue-100/80">
                Using advanced natural language processing and machine learning, 
                our system analyzes job postings in real-time, detecting subtle 
                patterns that indicate fraudulent activity with 99% accuracy.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="glass-card p-8 flex flex-col items-center">
              <Logo size="lg" />
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-blue-100/80">Users Protected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-blue-100/80">Scams Detected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-blue-100/80">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-blue-100/80">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
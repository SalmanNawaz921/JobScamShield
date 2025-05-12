// "use client";
// import React from "react";

// // Translation object (could be moved to a separate file)
// const featuresTranslations = {
//   title: "Features",
//   items: [
//     {
//       title: "Real-Time Detection",
//       description:
//         "Analyze job descriptions instantly and get fraud probability.",
//       icon: (
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//           />
//         </svg>
//       ),
//     },
//     {
//       title: "Secure Interaction",
//       description: "Built with Zero Trust principles to protect your data.",
//       icon: (
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//           />
//         </svg>
//       ),
//     },
//     {
//       title: "Continuous Learning",
//       description: "The bot improves over time with new data and feedback.",
//       icon: (
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//           />
//         </svg>
//       ),
//     },
//   ],
// };

// const FeaturesSection = () => {
//   return (
//     <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 ">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
//             {featuresTranslations.title}
//           </h2>
//           <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
//             Powerful features designed to protect you from job scams
//           </p>
//         </div>

//         <div className="grid gap-8 md:grid-cols-3 ">
//           {featuresTranslations.items.map((feature, index) => (
//             <div
//               key={index}
//               className=" glass-stat-card"
//             >
//               <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
//                 {feature.icon}
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-600">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <style jsx global>{`    .glass-stat-card {
//           padding: 1.5rem;
//           background: rgba(255, 255, 255, 0.05);
//           backdrop-filter: blur(8px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 16px;
//           transition: all 0.3s ease;
//         }
//         .glass-stat-card:hover {
//           background: rgba(255, 255, 255, 0.1);
//           transform: translateY(-5px);
//         }`}</style>
//     </section>
//   );
// };

// export default FeaturesSection;


"use client";
import React from "react";

const featuresTranslations = {
  title: "Features",
  items: [
    {
      title: "Real-Time Detection",
      description: "Analyze job descriptions instantly and get fraud probability.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Secure Interaction",
      description: "Built with Zero Trust principles to protect your data.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: "Continuous Learning",
      description: "The bot improves over time with new data and feedback.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ],
};

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-16 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-[80px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
            {featuresTranslations.title}
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-blue-100/80 mx-auto">
            Powerful features designed to protect you from job scams
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featuresTranslations.items.map((feature, index) => (
            <div
              key={index}
              className="glass-feature-card group"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/20 text-blue-200 mb-4 backdrop-blur-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-blue-100/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .glass-feature-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }
        .glass-feature-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.2);
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
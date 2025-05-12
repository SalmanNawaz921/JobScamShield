// import {
//   bgColor,
//   borderRadius,
//   flex,
//   font,
//   shadow,
//   spacing,
//   textColor,
//   textSize,
// } from "@/app/theme/tailwind.theme";
// import { LockKeyhole } from "lucide-react";

// const Logo = ({ title, description,size }) => {
//   return (
//     <div className="text-center">
//       <div className={flex.center}>
//         <div
//           className={`${bgColor.badge} ${spacing.p3} ${borderRadius.lg} ${shadow.badge}`}
//         >
//           <LockKeyhole className="h-8 w-8 text-white" size={size}/>
//         </div>
//       </div>
//       <h2
//         className={`${spacing.mt6} ${textSize.xl} ${font.bold} ${textColor.primary}`}
//       >
//         {title ? title : "JobScamShield"}
//       </h2>
//       <p
//         className={`${spacing.mt2} ${textSize.sm} ${textColor.secondary} mb-8`}
//       >
//         {description
//           ? description
//           : "Protect yourself from fraudulent job postings"}
//       </p>
//     </div>
//   );
// };

// export default Logo;

"use client";

import { LockKeyhole } from "lucide-react";

const Logo = ({ size = "xl", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/20`}
      >
        <span className="relative">
          <LockKeyhole className="h-8 w-8 text-white" size={size} />
          <span className="absolute -right-1 -top-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </span>
      </div>
      <div className="ml-3">
        <h1
          className={`${
            size === "xl" ? "text-3xl" : "text-xl"
          } font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white`}
        >
          Job Scam Shield
        </h1>
        <p
          className={`${
            size === "xl" ? "text-sm" : "text-xs"
          } text-blue-100/70`}
        >
          AI-Powered Protection
        </p>
      </div>
    </div>
  );
};

export default Logo;

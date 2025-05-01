// tailwind.config.js
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}","./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 10s linear infinite",
        bounce: "bounce 2s infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"], // Enables rounded scrollbars
  },
};

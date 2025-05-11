/** @type {import('next').NextConfig} */
const nextConfig = {
  // For hybrid Pages+App router
  experimental: {
    appDir: true,
  },
  middleware: "./src/middleware.js", // Explicit path
};

export default nextConfig;

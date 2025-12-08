/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: isDev
      ? [
          {
            protocol: "http",
            hostname: "localhost",
            port: "5058",
            pathname: "/**",
          },
        ]
      : [
          {
            protocol: "https",
            hostname: "https://sr-multi-vender-admin-api.onrender.com", // hosting domain
            pathname: "/**",
          },
        ],
  },
};

export default nextConfig;

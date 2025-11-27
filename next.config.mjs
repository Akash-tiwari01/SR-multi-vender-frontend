/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        // Must match the protocol (http or https)
        protocol: 'http', 
        
        // Must match the domain exactly
        hostname: 'localhost', 
        
        // You MUST include the port if your URI includes one
        port: '5058',          
        
        // Allows any path after the domain/port (e.g., /api/images/...)
        pathname: '/**',        
      },
    ]}
};

export default nextConfig;

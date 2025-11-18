import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack conflict aur json-server module not found ke hal ke liye
  experimental: {
     // swcMinify ko 'false' set karne se Webpack/SWC fallback ho jata hai.
     // Yeh Turbopack ko bypass karta hai.
     swcMinify: false, // <-- Sirf yeh ek line rakhen
  },

  // json-server aur next-connect ko external batane wala zaroori Webpack code
  webpack: (config, { isServer }) => {
    if (isServer) {
      // json-server aur next-connect ko Node.js ka hissa samjhein
      config.externals.push('json-server', 'next-connect');
    }
    return config;
  },
};

export default nextConfig;
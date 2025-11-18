/** @type {import('next').NextConfig} */
const nextConfig = {
  // Yeh line Turbopack ko zabardasti band kar degi aur Webpack istemal hoga.
  turbopack: {}, 

  webpack: (config, { isServer }) => {
    if (isServer) {
      // json-server aur next-connect ko external dependency bana diya
      config.externals.push('json-server', 'next-connect');
    }
    return config;
  },
};

module.exports = nextConfig;
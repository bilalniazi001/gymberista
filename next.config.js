/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sirf Webpack function rakha hai, taake Turbopack ka masla kam ho
  webpack: (config, { isServer }) => {
    // Yeh zaroori hai ke Vercel ke serverless environment mein packages milen
    if (isServer) {
      // json-server aur next-connect ko external dependency bana diya
      config.externals.push('json-server', 'next-connect');
    }
    return config;
  },

  // Agar aapko phir bhi Turbopack ka error aaye, toh neeche di gayi
  // experimental block ko uncomment (hata dein //) aur dobara deploy karein
  /*
  experimental: {
    forceSwcTransforms: true,
  },
  */
};

module.exports = nextConfig;
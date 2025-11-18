import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Yeh webpack configuration Next.js ko batati hai
  webpack: (config, { isServer }) => {
    // Yeh setting sirf server side (API Routes) ke liye zaroori hai
    if (isServer) {
      // json-server aur next-connect ko Node.js ka hissa samjhein
      // Isse woh packages Vercel ke runtime mein load honge, na ke build mein
      config.externals.push('json-server', 'next-connect');
    }

    return config;
  },
  
  // Agar aapne turbopack ko hata diya tha package.json se,
  // toh compiler section ko waise hi rakh sakte hain ya hata sakte hain.
  compiler: {
    // Agar koi specific setting nahi hai, toh isko hata sakte hain
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "buly.kr",
      },
      {
        hostname: "customer-1q4esalayy2bejw2.cloudflarestream.com",
      },
    ],
  },
};

export default nextConfig;

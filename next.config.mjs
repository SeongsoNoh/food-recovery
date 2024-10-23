/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        hostname: "buly.kr",
      },
    ],
  },
};

export default nextConfig;

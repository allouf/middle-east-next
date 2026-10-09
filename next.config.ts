import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Image optimization
  images: {
    loader: "custom",
    loaderFile: "./lib/utils/imageLoader.ts",

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }, {
        protocol: "http",
        hostname: "api.mideastcom.net",
      }, {
        protocol: "https",
        hostname: "storage.middleeastcommerce.net",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Webpack configuration for SVG support
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Turbopack configuration (empty to silence Next.js 16 warning)
  turbopack: {},

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "antd",
      "lucide-react"
    ],
  },

  // Output configuration
  output: "standalone",

  // Headers for security and SEO (CSP handled in middleware)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: [
              "camera=(self)",
              "microphone=(self)",
              "geolocation=(self)",
              "payment=(self)",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()",
              "autoplay=()",
              "encrypted-media=()",
              "fullscreen=(self)",
              "picture-in-picture=(self)",
              "sync-xhr=(self)",
              "interest-cohort=()"
            ].join(', ')
          },
        ],
      },
      // Next.js handles cache-control for _next assets; avoid manual override to prevent warnings
      // (Do not set Cache-Control for /_next/static/:path* or /_next/image routes.)
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.(svg|jpg|jpeg|png|gif|webp|avif|woff|woff2|ttf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.mideastcom.net/api/v1";
    const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "https://apiuat-nest.middleeastcommerce.net/api/v1/user";
    const mediaApiUrl = chatApiUrl.replace('/user', '/media');
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${apiUrl}/:path*`,
      },
      {
        source: "/api/chat-proxy/:path*",
        destination: `${chatApiUrl}/:path*`,
      },
      {
        source: "/api/media-proxy/:path*",
        destination: `${mediaApiUrl}/:path*`,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

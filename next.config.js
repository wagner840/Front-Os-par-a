/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração essencial para Coolify/Docker deployment
  output: "standalone",

  swcMinify: true,
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
    outputFileTracingRoot: undefined,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configurações de imagem para Coolify
  images: {
    domains: [
      "localhost",
      process.env.COOLIFY_FQDN || "",
      // Adicione outros domínios conforme necessário
    ].filter(Boolean),
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Configurações para resolver problemas de chunk loading
  webpack: (config, { isServer, dev }) => {
    // Configurar timeout para chunk loading
    if (!isServer) {
      config.output = {
        ...config.output,
        chunkLoadTimeout: 60000, // 60 segundos
      };
    }

    return config;
  },

  // Configurações de output para evitar problemas de paths
  trailingSlash: false,
  distDir: ".next",

  // Configurar headers para cache e segurança
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Configurações de rewrite para API
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },

  // Configurações adicionais
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts", "jsx", "js"],

  // Variáveis de ambiente públicas
  env: {
    COOLIFY_FQDN: process.env.COOLIFY_FQDN,
    COOLIFY_URL: process.env.COOLIFY_URL,
  },
};

module.exports = nextConfig;

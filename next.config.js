/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
    qualities: [75, 90, 100],
  },

  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/panel",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },

  // Headers de seguridad
  async headers() {
    return [
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
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Configuración de compilación
  compiler: {
    // Remover console.logs en producción
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Variables de entorno públicas
  env: {
    CUSTOM_KEY: "catalina-lezama-eventos",
    APP_NAME: "Catalina Lezama ED",
    APP_DESCRIPTION: "Eventos que Nadie Olvida",
  },

  // Configuración de webpack personalizada
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallbacks para módulos de Node.js en el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Configuración para APIs externas  
  async rewrites() {
    return [
      // Rewrite para APIs internas si es necesario - comentado porque puede causar conflictos
      // {
      //   source: "/api/supabase/:path*",
      //   destination: `https://your-project-id.supabase.co/:path*`,
      // },
    ];
  },

  // Configuración de output - comentado para Vercel deployment
  // output: "standalone",

  // Configuración de TypeScript
  typescript: {
    // Permitir build aunque haya errores de TypeScript en desarrollo
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    // Solo ejecutar ESLint en estos directorios durante build
    dirs: ["app", "components", "lib", "hooks"],
    // No fallar el build por warnings de ESLint
    ignoreDuringBuilds: false,
  },

  // Configuración de logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Configuración de Turbopack (Next.js 15+)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

module.exports = nextConfig;

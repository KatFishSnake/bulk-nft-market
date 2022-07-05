/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    dirs: ['src'],
  },

  swcMinify: true,

  reactStrictMode: true,

  images: {
    domains: ['openseauserdata.com'],
  },

  experimental: {
    runtime: 'experimental-edge',
    images: {
      remotePatterns: [
        {
          // The `src` property hostname must end with `.example.com`,
          // otherwise this will respond with 400 Bad Request.
          protocol: 'https',
          hostname: '**.*.*',
        },
      ],
    },
  },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

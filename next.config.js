/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gdurl.com', 'lh3.googleusercontent.com', 'res.cloudinary.com','cdn.discordapp.com','avatars.githubusercontent.com', 'firebasestorage.googleapis.com'],
  },
  output: "standalone",
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('file-loader'),
          options: {
            outputPath: 'static/sounds/',
            publicPath: `${config.assetPrefix || ''}/_next/static/sounds/`,
            name: '[name]-[hash].[ext]',
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;

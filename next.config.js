const path = require('path')
const withImages = require('next-images')
const withTM = require('next-transpile-modules')(['granen'])

module.exports = withTM(
  withImages({
    webpack: (config) => {
      config.resolve.alias['~'] = path.join(__dirname, '')
      if (process.env.NODE_ENV === 'development') {
        config.resolve.alias.react = path.resolve(__dirname, './node_modules/react')
      }
      return config
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: process.env.NODE_ENV !== 'development',
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/search',
          permanent: true,
          has: [
            {
              type: 'query',
              key: 'q',
            },
          ],
        },
      ]
    },
  }),
)

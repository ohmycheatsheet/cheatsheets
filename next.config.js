const path = require('path')
const withImages = require('next-images')
const fs = require('fs')
const gitUrlParse = require('git-url-parse')

const updateOpenSearch = () => {
  console.log('Update open-search file')
  const filepath = path.resolve(__dirname, './public/open-search.xml')
  const defaultOpenSearch = fs.readFileSync(filepath).toString()
  if (process.env.VERCEL) {
    const openSearch = defaultOpenSearch.replace(
      /ohmycheatsheet\.vercel\.app/g,
      process.env.NEXT_PUBLIC_VERCEL_URL,
    )
    return fs.writeFileSync(filepath, openSearch)
  }
  if (process.env.NETLIFY) {
    const openSearch = defaultOpenSearch.replace(
      /https:\/\/ohmycheatsheet\.vercel\.app/g,
      process.env.URL,
    )
    return fs.writeFileSync(filepath, openSearch)
  }
}

const define = () => {
  if (process.env.NETLIFY) {
    console.log('parse git url', process.env.REPOSITORY_URL)
    const { owner } = gitUrlParse(process.env.REPOSITORY_URL)
    // https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
    return {
      REPO_OWNER: JSON.stringify(owner),
      // e.g. https://www.petsofnetlify.com.
      URL: JSON.stringify(process.env.URL),
    }
  }
  if (process.env.VERCEL) {
    // https://vercel.com/docs/concepts/projects/environment-variables
    return {
      REPO_OWNER: JSON.stringify(process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER),
      HOSTNAME: JSON.stringify(process.env.NEXT_PUBLIC_VERCEL_URL),
      URL: JSON.stringify(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`),
    }
  }
  return {}
}

/**
 * @type {import('next').NextConfig}
 */
const config = {
  webpack: (config, context) => {
    config.resolve.alias['~'] = path.join(__dirname, '')
    if (process.env.NODE_ENV === 'development') {
      config.resolve.alias.react = path.resolve(__dirname, './node_modules/react')
    }
    config.plugins.push(new context.webpack.DefinePlugin(define()))
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
}

if (process.env.NODE_ENV === 'production') {
  updateOpenSearch()
}

module.exports = withImages(config)

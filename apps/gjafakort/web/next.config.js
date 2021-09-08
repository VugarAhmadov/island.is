const withTreat = require('../../../libs/shared/next-treat')()

const {
  API_URL = 'http://localhost:3333/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  SENTRY_DSN,
} = process.env

module.exports = withTreat({
  redirects() {
    return [
      {
        source: '/',
        destination: 'https://island.is/ferdagjof',
        permanent: true,
      },
      {
        source: '/personuverndarstefna',
        destination:
          'https://island.is/ferdagjof/ferdagjof-personuverndarstefna',
        permanent: true,
      },
    ]
  },
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    return config
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: API_URL,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: `${WEB_PUBLIC_URL}/api`,
    SENTRY_DSN,
  },
  env: {
    API_MOCKS: process.env.API_MOCKS || '',
  },
})

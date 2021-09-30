const withTreat = require('../../../libs/shared/next-treat')()
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')

const {
  API_URL = 'http://localhost:3333',
  WEB_PUBLIC_URL = 'http://localhost:4200',
} = process.env

const apiPath = '/api'
const graphqlPath = '/api/graphql'

module.exports = withTreat(
  withHealthcheckConfig({
    webpack: (config, options) => {
      // if (!options.isServer) {
      //   config.resolve.alias['@sentry/node'] = '@sentry/browser'
      // }
      return config
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: `${API_URL}${apiPath}`,
      graphqlEndpoint: `${API_URL}${graphqlPath}`,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: `${WEB_PUBLIC_URL}${apiPath}`,
      graphqlEndpoint: graphqlPath,
    },
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
    devIndicators: {
      autoPrerender: false,
    },
  }),
)

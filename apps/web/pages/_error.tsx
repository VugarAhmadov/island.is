import React from 'react'
import * as Sentry from '@sentry/node'
import {
  GetUrlQuery,
  QueryGetUrlArgs,
  ErrorPageQuery,
  QueryGetErrorPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_URL_QUERY, GET_ERROR_PAGE } from '@island.is/web/screens/queries'
import { ApolloClient } from '@apollo/client/core'
import { NormalizedCacheObject } from '@apollo/client/cache'
import ErrorComponent from '../screens/Error/Error'
import { getLocaleFromPath } from '../i18n/withLocale'
import Layout, { LayoutProps } from '../layouts/main'
import I18n, { Locale } from '../i18n/I18n'
import { withApollo } from '../graphql/withApollo'
import { linkResolver, LinkType } from '../hooks/useLinkResolver'

type ErrorPageProps = {
  statusCode: number
  locale: Locale
  layoutProps: LayoutProps
  errpage: ErrorPageQuery['getErrorPage']
}

class ErrorPage extends React.Component<ErrorPageProps> {
  state = { renderError: false }

  static getDerivedStateFromError(_error: Error) {
    // This means we had an error rendering the error page - We'll attempt to
    // render again with a simpler version
    return { renderError: true }
  }

  render() {
    const { layoutProps, locale, statusCode, errpage } = this.props
    const { renderError } = this.state

    if (layoutProps && !renderError) {
      // getDerivedStateFromError catches client-side render errors, but we need
      // try-catch for server-side rendering
      try {
        return (
          <I18n locale={locale} translations={layoutProps.namespace}>
            <Layout {...layoutProps}>
              <ErrorComponent errPage={errpage} statusCode={statusCode} />
            </Layout>
          </I18n>
        )
        // eslint-disable-next-line no-empty
      } catch {}
    }

    // fallback to simpler version if we're unable to use the Layout for any reason
    return <ErrorComponent errPage={errpage} statusCode={statusCode} />
  }

  static async getInitialProps(props /*: NextPageContext*/) {
    const { err, res, asPath = '' } = props
    const statusCode = err?.statusCode ?? res?.statusCode ?? 500
    const locale = getLocaleFromPath(asPath)

    if (!asPath.startsWith('/_next') && statusCode === 404) {
      const path = asPath
        .trim()
        .replace(/\/\/+/g, '/')
        .replace(/\/+$/, '')
        .toLowerCase()

      const redirectProps = await getRedirectProps({
        path,
        apolloClient: props.apolloClient,
        locale,
        statusCode,
      })

      if (redirectProps) {
        const { pageType, page } = redirectProps

        // Found an URL content type that contained this
        // path (which has a page assigned to it) so we redirect to that page
        if (pageType && page) {
          let type: string
          if (pageType === 'vidspyrna-frontpage') {
            type = 'adgerdirfrontpage'
          } else {
            type = pageType
          }

          const url = linkResolver(type as LinkType, [page.slug], locale).as

          if (!process.browser) {
            res.writeHead(302, { Location: url })
            res.end()
          } else {
            return (window.location.href = url)
          }
        }
      }
    }

    if (err) {
      Sentry.withScope((scope) => {
        Object.keys(err).forEach((key) => {
          scope.setExtra(key, err[key])
        })

        Sentry.captureException(err)
      })

      await Sentry.flush(2000)
    }

    // Set the actual http response code if rendering server-side
    if (res) {
      res.statusCode = statusCode
    }

    // we'll attempt to use the layout component, but if it goes wrong we'll
    // show a simplified error page without any header or footer
    let layoutProps: LayoutProps = null
    try {
      layoutProps = await Layout.getInitialProps({ ...props, locale })
      // eslint-disable-next-line no-empty
    } catch {}

    Sentry.captureException(
      new Error(`_error.tsx getInitialProps missing data at path: ${asPath}`),
    )

    await Sentry.flush(2000)

    return { statusCode, locale, layoutProps }
  }
}

export default withApollo(ErrorPage)

export interface RedirectProps {
  pageType: string
  page: {
    slug: string
    contentType: string
  }
}

interface GetRedirectPropsProps {
  path: string
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
  statusCode: number
}

const getRedirectProps = async ({
  path,
  apolloClient,
  locale,
  statusCode,
}: GetRedirectPropsProps) => {
  const [url, errpage] = await Promise.all([
    apolloClient
      .query<GetUrlQuery, QueryGetUrlArgs>({
        query: GET_URL_QUERY,
        variables: {
          input: {
            slug: path,
            lang: locale as string,
          },
        },
      })
      .then((response) => response.data.getUrl),
    apolloClient
      .query<ErrorPageQuery, QueryGetErrorPageArgs>({
        query: GET_ERROR_PAGE,
        variables: {
          input: {
            lang: locale,
            errorCode: statusCode.toString(),
          },
        },
      })
      .then((response) => response.data),
  ])

  const pageType = url?.page?.contentType ?? null

  if (!pageType) {
    return null
  }

  return {
    pageType,
    page: url.page,
    errpage,
  }
}

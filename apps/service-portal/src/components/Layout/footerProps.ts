import { ServicePortalFooterContent } from '@island.is/service-portal/graphql'
import { m } from '@island.is/service-portal/core'
import { MessageDescriptor } from 'react-intl'

type FormatMessage = (
  descriptor: string | MessageDescriptor,
  values?: any,
) => string

export const convertUrl = (url: string) =>
  url.startsWith('/') ? `https://island.is${url}` : url

export const getFooterProps = (
  data: ServicePortalFooterContent,
  formatMessage: FormatMessage,
) => ({
  hideLanguageSwith: true,
  topLinks:
    data.upper?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
  topLinksContact:
    data.upperContact?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
  showMiddleLinks: true,
  middleLinksTitle: formatMessage(m.middleLinksTitle),
  middleLinks:
    data.middle?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
  showTagLinks: true,
  tagLinksTitle: formatMessage(m.tagLinksTitle),
  tagLinks:
    data.tags?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
  bottomLinksTitle: formatMessage(m.bottomLinksTitle),
  bottomLinks:
    data.lower?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
})

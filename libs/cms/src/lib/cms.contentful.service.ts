/* eslint-disable @typescript-eslint/no-use-before-define */
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Injectable } from '@nestjs/common'
import sortBy from 'lodash/sortBy'
import * as types from './generated/contentfulTypes'
import { Article, mapArticle } from './models/article.model'
import { ContentSlug, mapContentSlug } from './models/contentSlug.model'
import { AboutPage, mapAboutPage } from './models/aboutPage.model'
import { GenericPage, mapGenericPage } from './models/genericPage.model'
import {
  GenericOverviewPage,
  mapGenericOverviewPage,
} from './models/genericOverviewPage.model'
import { News, mapNews } from './models/news.model'
import { Pagination } from './models/pagination.model'
import {
  AdgerdirFrontpage,
  mapAdgerdirFrontpage,
} from './models/adgerdirFrontpage.model'
import { AdgerdirPages } from './models/adgerdirPages.model'
import { AdgerdirPage, mapAdgerdirPage } from './models/adgerdirPage.model'
import { GetContentSlugInput } from './dto/getContentSlug.input'
import { GetAboutPageInput } from './dto/getAboutPage.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { GetGenericOverviewPageInput } from './dto/getGenericOverviewPage.input'
import { Namespace, mapNamespace } from './models/namespace.model'
import { Menu, mapMenu } from './models/menu.model'
import { LifeEventPage, mapLifeEventPage } from './models/lifeEventPage.model'
import { AdgerdirTags } from './models/adgerdirTags.model'
import { Organization } from './models/organization.model'
import { Organizations } from './models/organizations.model'
import { mapAdgerdirTag } from './models/adgerdirTag.model'
import { mapOrganization } from './models/organization.model'
import { OrganizationTags } from './models/organizationTags.model'
import { mapOrganizationTag } from './models/organizationTag.model'
import { ContentfulRepository } from './contentful.repository'
import { GetAlertBannerInput } from './dto/getAlertBanner.input'
import { AlertBanner, mapAlertBanner } from './models/alertBanner.model'
import { mapUrl, Url } from './models/url.model'
import { AboutSubPage, mapAboutSubPage } from './models/aboutSubPage.model'
import { mapTellUsAStory, TellUsAStory } from './models/tellUsAStory.model'
import { GetSubpageHeaderInput } from './dto/getSubpageHeader.input'
import { mapSubpageHeader, SubpageHeader } from './models/subpageHeader.model'
import {
  mapOrganizationSubpage,
  OrganizationSubpage,
} from './models/organizationSubpage.model'
import { GetErrorPageInput } from './dto/getErrorPage.input'
import { ErrorPage, mapErrorPage } from './models/errorPage.model'
import {
  OrganizationPage,
  mapOrganizationPage,
} from './models/organizationPage.model'
import { Auction, mapAuction } from './models/auction.model'
import { mapFrontpage, Frontpage } from './models/frontpage.model'
import { GetFrontpageInput } from './dto/getFrontpage.input'
import { OpenDataPage, mapOpenDataPage } from './models/openDataPage.model'
import { GetOpenDataPageInput } from './dto/getOpenDataPage.input'
import {
  OpenDataSubpage,
  mapOpenDataSubpage,
} from './models/openDataSubpage.model'
import { GetOpenDataSubpageInput } from './dto/getOpenDataSubpage.input'
import { mapProjectPage, ProjectPage } from './models/projectPage.model'
import { IProjectPage } from './generated/contentfulTypes'

const makePage = (
  page: number,
  perPage: number,
  totalResults: number,
): Pagination => ({
  page,
  perPage,
  totalResults,
  totalPages: Math.ceil(totalResults / perPage),
})

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in ' + name)
  }
}

const ArticleFields = [
  // we want to exclude relatedArticles because it's a self-referencing
  // relation and selecting related articles to a depth of 10 would make the
  // response huge
  'sys',
  'fields.slug',
  'fields.title',
  'fields.shortTitle',
  'fields.content',
  'fields.subgroup',
  'fields.group',
  'fields.category',
  'fields.subArticles',
].join(',')

@Injectable()
export class CmsContentfulService {
  constructor(private contentfulRepository: ContentfulRepository) {}

  async getAdgerdirFrontpage(lang = 'is-IS'): Promise<AdgerdirFrontpage> {
    const params = {
      ['content_type']: 'vidspyrna-frontpage',
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaFrontpageFields>(lang, params)
      .catch(errorHandler('getVidspyrnaFrontpage'))

    return (
      (result.items as types.IVidspyrnaFrontpage[]).map(
        mapAdgerdirFrontpage,
      )[0] ?? null
    )
  }

  async getAdgerdirPages(lang = 'is-IS'): Promise<AdgerdirPages> {
    const params = {
      ['content_type']: 'vidspyrnaPage',
      include: 10,
      limit: 100,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaPageFields>(lang, params)
      .catch(errorHandler('getAdgerdirPages'))

    return {
      items: (result.items as types.IVidspyrnaPage[]).map(mapAdgerdirPage),
    }
  }

  async getOrganizations(lang = 'is-IS'): Promise<Organizations> {
    const params = {
      ['content_type']: 'organization',
      include: 10,
      limit: 1000,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(lang, params)
      .catch(errorHandler('getOrganizations'))

    return {
      items: (result.items as types.IOrganization[])
        .map(mapOrganization)
        .filter((organization) => organization.title && organization.slug),
    }
  }

  async getAdgerdirTags(lang = 'is-IS'): Promise<AdgerdirTags> {
    const params = {
      ['content_type']: 'vidspyrnaTag',
      include: 10,
      limit: 100,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaTagFields>(lang, params)
      .catch(errorHandler('getAdgerdirTags'))

    return {
      items: (result.items as types.IVidspyrnaTag[]).map(mapAdgerdirTag),
    }
  }

  async getOrganizationTags(lang = 'is-IS'): Promise<OrganizationTags> {
    const params = {
      ['content_type']: 'organizationTag',
      include: 10,
      limit: 100,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationTagFields>(lang, params)
      .catch(errorHandler('getOrganizationTags'))

    return {
      items: (result.items as types.IOrganizationTag[]).map(mapOrganizationTag),
    }
  }

  async getAdgerdirPage(slug: string, lang: string): Promise<AdgerdirPage> {
    const params = {
      ['content_type']: 'vidspyrnaPage',
      include: 10,
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaPageFields>(lang, params)
      .catch(errorHandler('getAdgerdirPage'))

    return (
      (result.items as types.IVidspyrnaPage[]).map(mapAdgerdirPage)[0] ?? null
    )
  }

  async getOrganization(slug: string, lang: string): Promise<Organization> {
    const params = {
      ['content_type']: 'organization',
      include: 10,
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(lang, params)
      .catch(errorHandler('getOrganization'))

    return (
      (result.items as types.IOrganization[]).map(mapOrganization)[0] ?? null
    )
  }

  async getOrganizationPage(
    slug: string,
    lang: string,
  ): Promise<OrganizationPage> {
    const params = {
      ['content_type']: 'organizationPage',
      include: 10,
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationPageFields>(lang, params)
      .catch(errorHandler('getOrganizationPage'))

    return (
      (result.items as types.IOrganizationPage[]).map(mapOrganizationPage)[0] ??
      null
    )
  }

  async getOrganizationSubpage(
    organizationSlug: string,
    slug: string,
    lang: string,
  ): Promise<OrganizationSubpage> {
    const params = {
      ['content_type']: 'organizationSubpage',
      include: 10,
      'fields.slug': slug,
      'fields.organizationPage.sys.contentType.sys.id': 'organizationPage',
      'fields.organizationPage.fields.slug': organizationSlug,
    }
    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationSubpageFields>(lang, params)
      .catch(errorHandler('getOrganizationSubpage'))

    return (
      (result.items as types.IOrganizationSubpage[]).map(
        mapOrganizationSubpage,
      )[0] ?? null
    )
  }

  async getAuctions(
    lang: string,
    organization?: string,
    year?: number,
    month?: number,
  ): Promise<Auction[]> {
    // If year and date is not specified, we query for the next month
    const fromDate =
      year !== undefined && month !== undefined
        ? new Date(year, month, 1)
        : new Date()
    fromDate.setDate(fromDate.getDate() - 1)

    const toDate = new Date(fromDate.getTime())
    toDate.setMonth(toDate.getMonth() + 1)

    const params = {
      ['content_type']: 'auction',
      'fields.organization.sys.contentType.sys.id': 'organization',
      'fields.organization.fields.slug': organization ?? '',
      'fields.date[gte]': fromDate.toISOString(),
      'fields.date[lte]': toDate.toISOString(),
      order: 'fields.date',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAuctionFields>(lang, params)
      .catch(errorHandler('getAuctions'))

    return (result.items as types.IAuction[]).map(mapAuction)
  }

  async getAuction(id: string, lang: string): Promise<Auction> {
    const params = {
      ['content_type']: 'auction',
      'sys.id': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAuctionFields>(lang, params)
      .catch(errorHandler('getAuction'))

    return (result.items as types.IAuction[]).map(mapAuction)[0]
  }

  async getProjectPage(
    slug: string,
    lang: string,
  ): Promise<ProjectPage | null> {
    const params = {
      ['content_type']: 'projectPage',
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IProjectPageFields>(lang, params)
      .catch(errorHandler('getProjectPage'))

    return result.items.length
      ? mapProjectPage(result.items[0] as IProjectPage)
      : null
  }

  async getArticle(slug: string, lang: string): Promise<Article | null> {
    const params = {
      ['content_type']: 'article',
      'fields.slug': slug,
      select: ArticleFields,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getArticle'))

    return (result.items as types.IArticle[]).map(mapArticle)[0] ?? null
  }

  async getErrorPage({
    lang,
    errorCode,
  }: GetErrorPageInput): Promise<ErrorPage> {
    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IErrorPageFields>(lang, {
        ['content_type']: 'errorPage',
        'fields.errorCode': errorCode,
        include: 10,
      })
      .catch(errorHandler('getErrorPage'))

    return (result.items as types.IErrorPage[]).map(mapErrorPage)[0] ?? null
  }

  async getRelatedArticles(slug: string, lang: string): Promise<Article[]> {
    const params = {
      ['content_type']: 'article',
      'fields.slug': slug,
      select: 'fields.relatedArticles',
      include: 1,
    }

    const articleResult = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getRelatedArticles'))

    const articles = articleResult.items[0]?.fields?.relatedArticles ?? []
    if (articles.length === 0) return []

    const relatedResultParams = {
      ['content_type']: 'article',
      'sys.id[in]': articles.map((a) => a.sys.id).join(','),
      select: ArticleFields,
      include: 10,
    }

    const relatedResult = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, relatedResultParams)
      .catch(errorHandler('getRelatedArticles'))

    const sortedIds = articles.map((a) => a.sys.id)
    const results = (relatedResult.items as types.IArticle[]).map(mapArticle)
    return sortBy(results, (a) => sortedIds.indexOf(a.id))
  }

  async getNews(lang: string, slug: string): Promise<News | null> {
    const params = {
      ['content_type']: 'news',
      include: 10,
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.INewsFields>(lang, params)
      .catch(errorHandler('getNews'))

    return (result.items as types.INews[]).map(mapNews)[0] ?? null
  }

  async getAboutPage({ lang }: GetAboutPageInput): Promise<AboutPage | null> {
    const params = {
      ['content_type']: 'page',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IPageFields>(lang, params)
      .catch(errorHandler('getAboutPage'))

    return (result.items as types.IPage[]).map(mapAboutPage)[0] ?? null
  }

  async getAboutSubPage({
    lang,
    url,
  }: {
    lang: string
    url: string
  }): Promise<AboutSubPage | null> {
    const params = {
      ['content_type']: 'aboutSubPage',
      include: 10,
      'fields.url': url,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAboutSubPageFields>(lang, params)
      .catch(errorHandler('getAboutSubPage'))

    return (
      (result.items as types.IAboutSubPage[]).map(mapAboutSubPage)[0] ?? null
    )
  }

  async getContentSlug({
    id,
    lang,
  }: GetContentSlugInput): Promise<ContentSlug | null> {
    const params = {
      'sys.id': id,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getContentSlug'))

    return (result.items as types.IArticle[]).map(mapContentSlug)[0] ?? null
  }

  async getGenericPage({
    lang,
    slug,
  }: GetGenericPageInput): Promise<GenericPage> {
    const params = {
      ['content_type']: 'genericPage',
      'fields.slug': slug,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericPageFields>(lang, params)
      .catch(errorHandler('getGenericPage'))

    return (result.items as types.IGenericPage[]).map(mapGenericPage)[0] ?? null
  }

  async getGenericOverviewPage({
    lang,
    pageIdentifier,
  }: GetGenericOverviewPageInput): Promise<GenericOverviewPage> {
    const params = {
      ['content_type']: 'genericOverviewPage',
      'fields.pageIdentifier': pageIdentifier,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericOverviewPageFields>(lang, params)
      .catch(errorHandler('getGenericOverviewPage'))

    return (
      (result.items as types.IGenericOverviewPage[]).map(
        mapGenericOverviewPage,
      )[0] ?? null
    )
  }

  async getNamespace(
    namespace: string,
    lang: string,
  ): Promise<Namespace | null> {
    const params = {
      ['content_type']: 'uiConfiguration',
      'fields.namespace': namespace,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IUiConfigurationFields>(lang, params)
      .catch(errorHandler('getNamespace'))

    return (
      (result.items as types.IUiConfiguration[]).map(mapNamespace)[0] ?? null
    )
  }

  async getMenu(name: string, lang: string): Promise<Menu | null> {
    const params = {
      ['content_type']: 'menu',
      'fields.title': name,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IMenuFields>(lang, params)
      .catch(errorHandler('getMenu'))

    return (result.items as types.IMenu[]).map(mapMenu)[0] ?? null
  }

  async getLifeEventPage(
    slug: string,
    lang: string,
  ): Promise<LifeEventPage | null> {
    const params = {
      ['content_type']: 'lifeEventPage',
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEventPage'))

    return (
      (result.items as types.ILifeEventPage[]).map(mapLifeEventPage)[0] ?? null
    )
  }

  async getLifeEvents(lang: string): Promise<LifeEventPage[]> {
    const params = {
      ['content_type']: 'lifeEventPage',
      order: 'sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEvents'))

    return (result.items as types.ILifeEventPage[]).map(mapLifeEventPage)
  }

  async getAlertBanner({
    lang,
    id,
  }: GetAlertBannerInput): Promise<AlertBanner | null> {
    const params = {
      ['content_type']: 'alertBanner',
      'sys.id': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAlertBannerFields>(lang, params)
      .catch(errorHandler('getAlertBanner'))

    return (result.items as types.IAlertBanner[]).map(mapAlertBanner)[0] ?? null
  }

  async getUrl(slug: string, lang: string): Promise<Url | null> {
    const params = {
      ['content_type']: 'url',
      'fields.urlsList[all]': slug,
      include: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IUrlFields>(lang, params)
      .catch(errorHandler('getUrl'))
    return (result.items as types.IUrl[]).map(mapUrl)[0] ?? null
  }

  async getLifeEventsInCategory(
    lang: string,
    slug: string,
  ): Promise<LifeEventPage[]> {
    const params = {
      ['content_type']: 'lifeEventPage',
      'fields.category.sys.contentType.sys.id': 'articleCategory',
      'fields.category.fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEventsInCategory'))

    return (result.items as types.ILifeEventPage[]).map(mapLifeEventPage)
  }

  async getFrontpage({
    lang,
    pageIdentifier,
  }: GetFrontpageInput): Promise<Frontpage> {
    const params = {
      ['content_type']: 'frontpage',
      'fields.pageIdentifier': pageIdentifier,
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IFrontpageFields>(lang, params)
      .catch(errorHandler('getFrontpage'))

    return (result.items as types.IFrontpage[]).map(mapFrontpage)[0]
  }

  async getTellUsAStory({ lang }: { lang: string }): Promise<TellUsAStory> {
    const params = {
      ['content_type']: 'tellUsAStory',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ITellUsAStoryFields>(lang, params)
      .catch(errorHandler('getTellUsAStory'))

    return (result.items as types.ITellUsAStory[]).map(mapTellUsAStory)[0]
  }

  async getSubpageHeader({
    lang,
    id,
  }: GetSubpageHeaderInput): Promise<SubpageHeader> {
    const params = {
      ['content_type']: 'subpageHeader',
      'fields.subpageId': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISubpageHeaderFields>(lang, params)
      .catch(errorHandler('getSubpageHeader'))

    return (result.items as types.ISubpageHeader[]).map(mapSubpageHeader)[0]
  }

  async getOpenDataPage({ lang }: GetOpenDataPageInput): Promise<OpenDataPage> {
    const params = {
      ['content_type']: 'openDataPage',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOpenDataPageFields>(lang, params)
      .catch(errorHandler('getOpenDataPage'))

    return (
      (result.items as types.IOpenDataPage[]).map(mapOpenDataPage)[0] ?? null
    )
  }

  async getOpenDataSubpage({
    lang,
  }: GetOpenDataSubpageInput): Promise<OpenDataSubpage> {
    const params = {
      ['content_type']: 'openDataSubpage',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOpenDataSubpageFields>(lang, params)
      .catch(errorHandler('getOpenDataSubpage'))

    return (
      (result.items as types.IOpenDataSubpage[]).map(mapOpenDataSubpage)[0] ??
      null
    )
  }
}

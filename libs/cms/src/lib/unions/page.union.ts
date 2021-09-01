import { createUnionType } from '@nestjs/graphql'
import { Article, mapArticle } from '../models/article.model'
import { AboutPage, mapAboutPage } from '../models/aboutPage.model'
import { AboutSubPage, mapAboutSubPage } from '../models/aboutSubPage.model'
import { mapSubArticle, SubArticle } from '../models/subArticle.model'
import { LifeEventPage, mapLifeEventPage } from '../models/lifeEventPage.model'
import { AdgerdirPage, mapAdgerdirPage } from '../models/adgerdirPage.model'
import {
  AdgerdirFrontpage,
  mapAdgerdirFrontpage,
} from '../models/adgerdirFrontpage.model'
import {
  IAboutSubPage,
  IArticle,
  IArticleCategory,
  ILifeEventPage,
  INews,
  IPage,
  ISubArticle,
  IVidspyrnaFrontpage,
  IVidspyrnaPage,
} from '../generated/contentfulTypes'
import { ApolloError } from 'apollo-server-express'
import { mapNews, News } from '../models/news.model'
import {
  ArticleCategory,
  mapArticleCategory,
} from '../models/articleCategory.model'

export type PageTypes =
  | IArticle
  | ISubArticle
  | IPage
  | IAboutSubPage
  | ILifeEventPage
  | IVidspyrnaPage
  | IVidspyrnaFrontpage
  | INews
  | IArticleCategory

export const PageUnion = createUnionType({
  name: 'Page',
  types: () => [
    Article,
    SubArticle,
    AboutPage,
    AboutSubPage,
    LifeEventPage,
    AdgerdirPage,
    AdgerdirFrontpage,
    News,
    ArticleCategory,
  ],
  resolveType: (document) => document.typename, // typename is appended to request on indexing
})

export const mapPageUnion = (page: PageTypes): typeof PageUnion => {
  const contentType = page.sys.contentType?.sys?.id
  switch (contentType) {
    case 'article': {
      return mapArticle(page as IArticle)
    }
    case 'subArticle': {
      return mapSubArticle(page as ISubArticle)
    }
    case 'page': {
      return mapAboutPage(page as IPage)
    }
    case 'aboutSubPage': {
      return mapAboutSubPage(page as IAboutSubPage)
    }
    case 'lifeEventPage': {
      return mapLifeEventPage(page as ILifeEventPage)
    }
    case 'vidspyrnaPage': {
      return mapAdgerdirPage(page as IVidspyrnaPage)
    }
    case 'vidspyrna-frontpage': {
      return mapAdgerdirFrontpage(page as IVidspyrnaFrontpage)
    }
    case 'news': {
      return mapNews(page as INews)
    }
    case 'articleCategory': {
      return mapArticleCategory(page as IArticleCategory)
    }
    default: {
      throw new ApolloError(`Can not map to page union: ${contentType}`)
    }
  }
}

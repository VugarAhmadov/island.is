import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  ISODate,
  LawChapterSlug,
  MinistrySlug,
  RegQueryName,
  Year,
} from '@island.is/regulations'
import {
  Regulation,
  RegulationLawChapter,
  RegulationLawChapterTree,
  RegulationListItem,
  RegulationMinistryList,
  RegulationOriginalDates,
  RegulationRedirect,
  RegulationSearchResults,
  RegulationViewTypes,
  RegulationYears,
} from '@island.is/regulations/web'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

export const REGULATIONS_OPTIONS = 'REGULATIONS_OPTIONS'

export interface RegulationsServiceOptions {
  url: string
  ttl?: number
}

export class RegulationsService extends RESTDataSource {
  constructor(
    @Inject(REGULATIONS_OPTIONS)
    private readonly options: RegulationsServiceOptions,
  ) {
    super()
    this.baseURL = `${this.options.url}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }
  /*
  Example api routes for regulation
  regulation/[name]/current
  regulation/[name]/original
  regulation/[name]/diff
  regulation/[name]/d/[date]
  regulation/[name]/d/[date]/diff
  regulation/[name]/d/[date]/diff/[earlierDate]
*/
  async getRegulation(
    viewType: RegulationViewTypes,
    name: RegQueryName,
    date?: ISODate,
    isCustomDiff?: boolean,
    _earlierDate?: ISODate | RegulationOriginalDates.gqlHack,
  ): Promise<Regulation | RegulationRedirect | null> {
    const earlierDate =
      _earlierDate === RegulationOriginalDates.gqlHack
        ? RegulationOriginalDates.api
        : _earlierDate

    let params: string = viewType

    if (viewType === 'd') {
      if (date) {
        params = 'd/' + date
        if (isCustomDiff) {
          params += '/diff' + (earlierDate ? '/' + earlierDate : '')
        }
      } else {
        // Treat `viewType` 'd' with no `date` as 'current'
        // ...either that or throwing an error...
        // ...or tightening the type signature to prevent that happening.
        params = 'current'
      }
    }
    const response = await this.get<Regulation | RegulationRedirect | null>(
      `/regulation/${name}/${params}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulations(
    type: 'newest',
    page?: number,
  ): Promise<RegulationSearchResults | null> {
    page = page && page > 1 ? page : undefined
    const response = await this.get<RegulationSearchResults | null>(
      `regulations/${type}${page ? '?page=' + page : ''}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationsSearch(
    q?: string,
    rn?: string,
    year?: Year,
    yearTo?: Year,
    ch?: string,
    iA?: boolean,
    iR?: boolean,
    page?: number,
  ): Promise<RegulationListItem[] | null> {
    const response = await this.get<RegulationListItem[] | null>(
      `search`,
      // Strip away empty params
      // Object.fromEntries(Object.entries({ q, rn, year, yearTo, ch, iA, iR, page }).filter((val) => val))
      pickBy({ q, rn, year, yearTo, ch, iA, iR, page }, identity),
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationsYears(): Promise<RegulationYears | null> {
    const response = await this.get<RegulationYears | null>(`years`, {
      cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
    })
    return response
  }

  async getRegulationsMinistries(
    slugs?: Array<MinistrySlug>,
  ): Promise<RegulationMinistryList | null> {
    const response = await this.get<RegulationMinistryList | null>(
      `ministries${slugs ? '?slugs=' + slugs.join(',') : ''}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationsLawChapters(
    tree: boolean,
    slugs?: Array<LawChapterSlug>,
  ): Promise<RegulationLawChapterTree | RegulationLawChapter[] | null> {
    const response = await this.get<
      RegulationLawChapterTree | RegulationLawChapter[] | null
    >(
      `lawchapters${tree ? '/tree' : ''}${
        slugs ? '?slugs=' + slugs.join(',') : ''
      }`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }
}

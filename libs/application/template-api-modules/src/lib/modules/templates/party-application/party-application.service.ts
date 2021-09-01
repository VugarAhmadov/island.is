import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignSupremeCourtApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
  GenerateAssignSupremeCourtApplicationEmailOptions,
} from './emailGenerators'
import { EndorsementListApi, EndorsementListTagsEnum } from './gen/fetch'
import type { Logger } from '@island.is/logging'

const ONE_DAY_IN_SECONDS_EXPIRES = 24 * 60 * 60

export const PARTY_APPLICATION_SERVICE_OPTIONS =
  'PARTY_APPLICATION_SERVICE_OPTIONS'

const CREATE_ENDORSEMENT_LIST_QUERY = `
  mutation EndorsementSystemCreatePartyLetterEndorsementList($input: CreateEndorsementListDto!) {
    endorsementSystemCreateEndorsementList(input: $input) {
      id
    }
  }
`

interface ErrorResponse {
  errors: {
    message: string
  }
}

type EndorsementListResponse =
  | {
      data: {
        endorsementSystemCreateEndorsementList: {
          id: string
        }
      }
    }
  | ErrorResponse

export interface PartyApplicationServiceOptions {
  adminEmails: GenerateAssignSupremeCourtApplicationEmailOptions
}

interface PartyLetterData {
  partyName: string
  partyLetter: string
}

/**
 * We proxy the auth header to the subsystem where it is resolved.
 */
interface FetchParams {
  url: string
  init: RequestInit
}

interface RequestContext {
  init: RequestInit
}

interface Middleware {
  pre?(context: RequestContext): Promise<FetchParams | void>
}
class ForwardAuthHeaderMiddleware implements Middleware {
  constructor(private bearerToken: string) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: this.bearerToken,
    })
  }
}

@Injectable()
export class PartyApplicationService {
  constructor(
    private endorsementListApi: EndorsementListApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(PARTY_APPLICATION_SERVICE_OPTIONS)
    private options: PartyApplicationServiceOptions,
  ) {}

  endorsementListApiWithAuth(token: string) {
    return this.endorsementListApi.withMiddleware(
      new ForwardAuthHeaderMiddleware(token),
    )
  }

  async assignSupremeCourt({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.endorsementListApiWithAuth(authorization)
      .endorsementListControllerClose({ listId })
      .then(async () => {
        await this.sharedTemplateAPIService.assignApplicationThroughEmail(
          generateAssignSupremeCourtApplicationEmail(this.options.adminEmails),
          application,
          ONE_DAY_IN_SECONDS_EXPIRES,
        )
      })
      .catch(() => {
        this.logger.error('Failed to close endorsement list', listId)
        throw new Error('Failed to close endorsement list')
      })
  }

  async applicationRejected({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.endorsementListApiWithAuth(authorization)
      .endorsementListControllerOpen({ listId })
      .then(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationRejectedEmail,
          application,
        )
      })
      .catch(() => {
        this.logger.error('Failed to open endorsement list', listId)
        throw new Error('Failed to open endorsement list')
      })
  }

  async applicationApproved({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }

  async createEndorsementList({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const partyLetter = application.externalData.partyLetterRegistry
      ?.data as PartyLetterData
    const endorsementList: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY, {
        input: {
          title: partyLetter.partyName,
          description: partyLetter.partyLetter,
          endorsementMeta: ['fullName', 'address', 'signedTags'],
          tags: [application.answers.constituency as EndorsementListTagsEnum],
          validationRules: [
            {
              type: 'minAgeAtDate',
              value: {
                date: '2021-09-25T00:00:00Z',
                age: 18,
              },
            },
            {
              type: 'uniqueWithinTags',
              value: {
                tags: [
                  EndorsementListTagsEnum.partyApplicationNordausturkjordaemi2021,
                  EndorsementListTagsEnum.partyApplicationNordvesturkjordaemi2021,
                  EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiNordur2021,
                  EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiSudur2021,
                  EndorsementListTagsEnum.partyApplicationSudurkjordaemi2021,
                  EndorsementListTagsEnum.partyApplicationSudvesturkjordaemi2021,
                ],
              },
            },
          ],
          meta: {
            // to be able to link back to this application
            applicationTypeId: application.typeId,
            applicationId: application.id,
          },
        },
      })
      .then((response) => response.json())

    if ('errors' in endorsementList) {
      throw new Error('Failed to create endorsement list')
    }

    // This gets written to externalData under the key createEndorsementList
    return {
      id: endorsementList.data.endorsementSystemCreateEndorsementList.id,
    }
  }
}

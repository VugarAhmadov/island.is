import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { GeneralPetitionService } from './general-petition.service'
import {
  Configuration as endorsementConfig,
  EndorsementListApi,
} from './gen/fetch/endorsements'

export class GeneralPetitionModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: GeneralPetitionModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        GeneralPetitionService,
        {
          provide: EndorsementListApi,
          useFactory: async () =>
            new EndorsementListApi(
              new endorsementConfig({
                fetchApi: fetch,
                basePath: config.generalPetition.endorsementsApiBasePath,
              }),
            ),
        },
      ],
      exports: [GeneralPetitionService],
    }
  }
}

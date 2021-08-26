import { Module, DynamicModule } from '@nestjs/common'

import {
  NationalRegistryXRoadConfig,
  NationalRegistryXRoadModule,
} from '@island.is/api/domains/national-registry-x-road'

import { NationalRegistryResolver } from './nationalRegistry.resolver'
import { NationalRegistryService } from './nationalRegistry.service'

export type Config = {
  nationalRegistryXRoad: NationalRegistryXRoadConfig
}

@Module({})
export class NationalRegistryModule {
  static register(config: Config): DynamicModule {
    return {
      module: NationalRegistryModule,
      imports: [
        NationalRegistryXRoadModule.register(config.nationalRegistryXRoad),
      ],
      providers: [NationalRegistryResolver, NationalRegistryService],
      exports: [NationalRegistryService],
    }
  }
}

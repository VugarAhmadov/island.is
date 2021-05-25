import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'services-party-letter-registry-api',
  openApi,
  port: 4251,
  swaggerPath: '',
})

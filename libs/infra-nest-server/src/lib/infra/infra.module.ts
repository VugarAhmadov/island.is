import { Module, DynamicModule, Type } from '@nestjs/common'
import { InfraController } from './infra.controller'
import { LoggingModule } from '@island.is/logging'
import { ProblemModule } from '@island.is/nest/problem'

interface InfraModuleOptions {
  appModule: Type<any>
  convertAllErrors?: boolean
}

@Module({
  controllers: [InfraController],
  imports: [LoggingModule],
})
export class InfraModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static forRoot({
    appModule,
    convertAllErrors,
  }: InfraModuleOptions): DynamicModule {
    return {
      module: InfraModule,
      imports: [appModule, ProblemModule.register({ convertAllErrors })],
    }
  }
}

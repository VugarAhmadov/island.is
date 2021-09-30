import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './httpException.filter'
import { ProblemFilter } from './problem.filter'
import { ErrorFilter } from './error.filter'
import { LoggingModule } from '@island.is/logging'

@Module({
  imports: [LoggingModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ProblemFilter,
    },
  ],
})
export class ProblemModule {
  static register({ convertAllErrors = true }) {
    return {
      module: ProblemModule,
      providers: convertAllErrors
        ? [
            {
              provide: APP_FILTER,
              useClass: HttpExceptionFilter,
            },
            {
              provide: APP_FILTER,
              useClass: ErrorFilter,
            },
          ]
        : [],
    }
  }
}

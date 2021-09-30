import { ExceptionFilter, Catch, ArgumentsHost, Inject } from '@nestjs/common'
import { Response } from 'express'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Problem, ProblemError } from './ProblemError';
import { ApolloError } from 'apollo-server-express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  logger: Logger

  constructor(
    @Inject(LOGGER_PROVIDER)
    logger: Logger,
  ) {
    this.logger = logger.child({ context: 'ErrorFilter' })
  }

  catch(error: Error, host: ArgumentsHost) {
    if (host.getType() as string === 'graphql') {
      const problem = error as ProblemError
      throw new ApolloError(problem.message, problem.problem?.type ?? 'INTERNAL_SERVER_ERROR', {problem: problem.problem})
    }

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error(error)
    response.setHeader('Content-Language', 'en')
    response.setHeader('Content-Type', 'application/problem+json')
    response.status(500).json(this.getProblem(error))
  }

  getProblem(error: Error): Problem<{ stack?: string }> {
    const extraDetails =
      process.env.NODE_ENV !== 'production'
        ? { details: error.message, stack: error.stack }
        : null

    return {
      status: 500,
      type: 'https://httpstatuses.com/500',
      title: 'Internal server error',
      ...extraDetails,
    }
  }
}

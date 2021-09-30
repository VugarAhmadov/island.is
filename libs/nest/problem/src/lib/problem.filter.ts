import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common'
import { Response } from 'express'
import { ProblemError } from './ProblemError'

@Catch(ProblemError)
export class ProblemFilter implements ExceptionFilter {
  catch(problem: ProblemError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    console.log('HANDLING PROBLEM', problem)

    response.setHeader('Content-Language', 'en')
    response.setHeader('Content-Type', 'application/problem+json')
    response.status(problem.problem.status || 500).json(problem.problem)
  }
}

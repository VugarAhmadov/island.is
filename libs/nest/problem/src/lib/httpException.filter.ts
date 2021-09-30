import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { Problem } from './ProblemError';

type ErrorResponse = string | { message: string; error?: string }

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    response.setHeader('Content-Language', 'en')
    response.setHeader('Content-Type', 'application/problem+json')
    response.status(status).json(this.getProblemInfo(exception))
  }

  getProblemInfo(exception: HttpException): Problem {
    const status = exception.getStatus()
    const response = exception.getResponse() as ErrorResponse
    if (typeof response === 'string') {
      return {
        status,
        type: `https://httpstatuses.com/${status}`,
        title: response,
      }
    }
    return {
      status,
      type: `https://httpstatuses.com/${status}`,
      title: response.error || response.message,
      detail: response.error ? response.message : undefined,
    }
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'

type ErrorResponse = string | { message: string; error?: string }

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    console.log('HANDLING EXCEPTION', exception)

    response.setHeader('Content-Language', 'en')
    response.setHeader('Content-Type', 'application/problem+json')
    response.status(status).json(this.getProblemInfo(exception))
  }

  getProblemInfo(exception: HttpException) {
    const status = exception.getStatus()
    const response = exception.getResponse() as ErrorResponse
    if (typeof response === 'string') {
      return {
        statusCode: status,
        type: `https://httpstatuses.com/${status}`,
        title: response,
      }
    } else if (status === 400 && Array.isArray(response.message)) {
      return {
        statusCode: status,
        type: `https://api.vmst.is/errors/validation-failed`,
        title: 'Validation failed',
        validationErrors: response.message,
      }
    }
    return {
      statusCode: status,
      type: `https://httpstatuses.com/${status}`,
      title: response.error || response.message,
      detail: response.error ? response.message : undefined,
    }
  }
}

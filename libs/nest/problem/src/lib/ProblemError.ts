import { HttpException } from '@nestjs/common'
import { Merge } from 'type-fest'

type HttpExceptionResponse = string | { message: string; error?: string }

export interface ProblemDetails {
  type: string
  title: string
  status?: number
  detail?: string
  instance?: string
}

export type Problem<ExtensionMembers = unknown> = ProblemDetails &
  ExtensionMembers

export class ProblemError<ExtensionMembers = Record<string, never>> extends Error {
  constructor(public problem: Problem<ExtensionMembers>) {
    super(
      problem.detail ? `${problem.title} - ${problem.detail}` : problem.title,
    )
    Object.defineProperty(this, 'name', { value: 'ProblemError' })

    if (
      process.env.NODE_ENV !== 'production' &&
      !problem.type.startsWith('http')
    ) {
      throw new Error('ProblemError type must be a URL.')
    }
  }

  static fromHttpException(exception: HttpException) {
    const status = exception.getStatus()
    const response = exception.getResponse() as HttpExceptionResponse
    let title, detail
    if (typeof response === 'string') {
      title = response
    } else {
      title = response.error || response.message
      detail = response.error ? response.message : undefined
    }

    return new ProblemError({
      status: status,
      type: `https://httpstatuses.com/${status}`,
      title,
      detail,
    })
  }
}

import { BadRequestException, HttpException } from '@nestjs/common'
import { Problem } from './Problem'

describe('Problem', () => {
  it('supports basic problem details', () => {
    // Arrange
    const problem = { type: 'https://island.is', title: 'Test error' }

    // Act
    const problemError = new Problem(problem)

    // Assert
    expect(problemError).toMatchObject({
      message: problem.title,
      problem: problem,
    })
  })

  it('supports full problem details', () => {
    // Arrange
    const problem = {
      type: 'https://island.is',
      title: 'Test error',
      status: 400,
      detail: 'Details',
      instance: 'instance',
    }

    // Act
    const problemError = new Problem(problem)

    // Assert
    expect(problemError).toMatchObject({
      message: [problem.title, problem.detail].join(' - '),
      problem: problem,
    })
  })

  it('supports extension members', () => {
    // Arrange
    const problem = {
      type: 'https://island.is',
      title: 'Test error',
      extension: 'test',
    }

    // Act
    const problemError = new Problem(problem)

    // Assert
    expect(problemError).toMatchObject({
      message: problem.title,
      problem: problem,
    })
  })

  it('support http exceptions with string response', () => {
    // Arrange
    const exception = new HttpException('Test', 500)

    // Act
    const problemError = Problem.fromHttpException(exception)

    // Assert
    expect(problemError).toMatchObject({
      message: 'Test',
      problem: {
        type: 'https://httpstatuses.com/500',
        title: 'Test',
        status: 500,
      },
    })
  })

  it('support http exceptions with error response', () => {
    // Arrange
    const exception = new BadRequestException('This happened')

    // Act
    const problemError = Problem.fromHttpException(exception)

    // Assert
    expect(problemError).toMatchObject({
      message: 'Bad Request - This happened',
      problem: {
        type: 'https://httpstatuses.com/400',
        title: 'Bad Request',
        detail: 'This happened',
        status: 400,
      },
    })
  })
})

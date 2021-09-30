import { ProblemError } from './ProblemError'

type FieldValidationErrors = { [key: string]: string | FieldValidationErrors }

const TYPE = 'https://docs.devland.is/reference/problems/validation-problem'
const TITLE = 'Validation failed'

interface ValidationExtensions {
  fields: FieldValidationErrors
}

export class ValidationProblem extends ProblemError<ValidationExtensions> {
  constructor(fields: FieldValidationErrors) {
    super({
      type: TYPE,
      title: TITLE,
      status: 400,
      detail: `Found issues in these fields: ${Object.keys(fields).join(', ')}`,
      fields,
    })
  }
}

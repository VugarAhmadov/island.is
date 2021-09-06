export type IslykillErrorResult = {
  message: string
  code: number
  invalidFields: string[]
}

export type IslykillUpdateResponse = {
  nationalId: string
  valid: boolean
  error?: IslykillErrorResult
}

export type IslykillSettings = {
  nationalId: string
  email?: string
  mobile?: string
  bankInfo?: string
  lastLogin?: string
  nextLastLogin?: string
  lastPassChange?: string
  canNudge?: boolean
  onlyCert?: boolean
  nudgeLastAsked?: string
}

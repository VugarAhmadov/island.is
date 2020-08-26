import { Injectable } from '@nestjs/common'

import { Permissions, AuthUser } from './auth.types'

const DEVELOPERS = [
  /* Vice Versa */
  '1501933119', // Darri
  '2101932009', // David

  /* Kosmos & Kaos */
  '2501893469', // Brian
]

const ADMINS = [
  /* Stafrænt Ísland */
  '1903795829', // Örvar
]

const TESTERS = [
  /* Stafrænt Ísland */
  '1903795829', // Örvar
]

@Injectable()
export class AuthService {
  getRole(user: AuthUser): Permissions['role'] {
    if (DEVELOPERS.includes(user.nationalId)) {
      return 'developer'
    } else if (ADMINS.includes(user.nationalId)) {
      return 'admin'
    } else if (TESTERS.includes(user.nationalId)) {
      return 'tester'
    } else {
      return 'user'
    }
  }

  checkPermissions(user: AuthUser, { role }: Permissions): boolean {
    switch (role) {
      case 'developer':
        return DEVELOPERS.includes(user.nationalId)
      case 'admin':
        return [...ADMINS, ...DEVELOPERS].includes(user.nationalId)
      case 'tester':
        return false
      default: {
        if (role) {
          return false
        }
        return true
      }
    }
  }
}

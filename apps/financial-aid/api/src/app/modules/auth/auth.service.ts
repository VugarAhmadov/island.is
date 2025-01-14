import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'
import { uuid } from 'uuidv4'

import { User, RolesRule, ReturnUrl } from '@island.is/financial-aid/shared/lib'

import { environment } from '../../../environments'

@Injectable()
export class AuthService {
  async findUser(nationalId: string): Promise<User | undefined> {
    const res = await fetch(
      `${environment.backend.url}/api/user/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    )

    if (!res.ok) {
      return undefined
    }

    return await res.json()
  }

  fakeUser(nationalId: string) {
    const fakeUsers: { [key: string]: User } = {
      '0000000000': {
        nationalId: '0000000000',
        name: 'Lárus Árnasson',
        phoneNumber: '9999999',
        folder: uuid(),
        service: RolesRule.OSK,
        postalCode: 220,
        returnUrl: ReturnUrl.APPLICATION,
      },
      '0000000004': {
        nationalId: '0000000004',
        name: 'Lárus Rikkason',
        phoneNumber: '9999999',
        folder: uuid(),
        service: RolesRule.OSK,
        postalCode: 102,
        returnUrl: ReturnUrl.APPLICATION,
      },
      '0000000001': {
        nationalId: '0000000001',
        name: 'Lára Margrétardóttir',
        phoneNumber: '9999999',
        folder: uuid(),
        service: RolesRule.OSK,
        returnUrl: ReturnUrl.APPLICATION,
      },
      '0000000002': {
        nationalId: '0000000002',
        name: 'Klára Línudóttir',
        phoneNumber: '9999999',
        folder: uuid(),
        service: RolesRule.VEITA,
        returnUrl: ReturnUrl.ADMIN,
      },
      '0000000003': {
        nationalId: '0000000003',
        name: 'Lárhéðinn Frillason',
        phoneNumber: '9999999',
        folder: uuid(),
        service: RolesRule.OSK,
        returnUrl: ReturnUrl.APPLICATION,
      },
    }

    if (nationalId in fakeUsers) {
      return fakeUsers[nationalId]
    }

    return undefined
  }
}

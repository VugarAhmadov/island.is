import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AllowedFakeUsers,
  ApplicationState,
  CurrentApplication,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import type { User } from '@island.is/financial-aid/shared/lib'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/financial-aid/auth'

import { UserModel } from './user.model'
import { UserService } from './user.service'

import { CurrentApplicationModel } from '../application'
import { environment } from '../../../environments'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private fakeUsers: { [key: string]: CurrentApplication | null } = {
    '0000000000': null,
    '0000000001': {
      id: 'dbfc6ff1-58e0-4815-8fa9-1e06ddace1c3',
      state: ApplicationState.INPROGRESS,
      homeCircumstances: HomeCircumstances.OWNPLACE,
      usePersonalTaxCredit: true,
    },
    '0000000003': {
      id: '5ebdb6ca-edcb-4391-bda7-f5999d2b6b08',
      state: ApplicationState.DATANEEDED,
      homeCircumstances: HomeCircumstances.OWNPLACE,
      usePersonalTaxCredit: true,
    },
  }

  @Query(() => UserModel, { nullable: true })
  async currentUser(
    @CurrentGraphQlUser() user: User,
  ): Promise<UserModel | undefined> {
    this.logger.debug('Getting current user')

    return user as UserModel
  }

  @ResolveField('currentApplication', () => CurrentApplicationModel)
  async currentApplication(
    @Parent() user: User,
  ): Promise<CurrentApplicationModel | null> {
    // Local development
    if (environment.auth.allowFakeUsers && user.nationalId in this.fakeUsers) {
      return this.fakeUsers[user.nationalId]
    }
    return await this.userService.getCurrentApplication(user.nationalId)
  }
}

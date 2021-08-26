import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Parent, Context } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { NationalRegistrySpouse } from '../models/nationalRegistrySpouse.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver(() => NationalRegistryPerson)
@Audit({ namespace: '@island.is/api/national-registry-x-road' })
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => NationalRegistryPerson, {
    name: 'nationalRegistryUserV2',
  })
  @Audit()
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryPerson | undefined> {
    return await this.nationalRegistryXRoadService.getNationalRegistryPerson(
      user.nationalId,
      user.authorization,
    )
  }

  @ResolveField('children', () => [NationalRegistryPerson])
  @Audit()
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryPerson[] | undefined> {
    return await this.nationalRegistryXRoadService.getChildrenCustodyInformation(
      person.nationalId,
      user.authorization,
    )
  }

  @ResolveField('spouse', () => [NationalRegistrySpouse])
  @Audit()
  async resolveSpouse(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistrySpouse | undefined> {
    return await this.nationalRegistryXRoadService.getSpouse(
      person.nationalId,
      user.authorization,
    )
  }
}

import { Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { NationalRegistryPerson } from './models/nationalRegistryPerson.model'
import { NationalRegistryService } from './nationalRegistry.service'

@Resolver(() => NationalRegistryPerson)
export class NationalRegistryResolver {
  constructor(private nationalRegistryService: NationalRegistryService) {}

  @Query(() => NationalRegistryPerson, { nullable: true })
  userAndSpouse(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryPerson | null> {
    return this.nationalRegistryService.getUserAndSpouse(user)
  }
}

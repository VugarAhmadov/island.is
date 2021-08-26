import { Field, ID } from '@nestjs/graphql'

import { NationalRegistryAddress } from './nationalRegistryAddress.model'
import { NationalRegistrySpouse } from './nationalRegistrySpouse.model'

export class NationalRegistryPerson {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress

  @Field(() => NationalRegistrySpouse, { nullable: true })
  spouse?: NationalRegistrySpouse
}

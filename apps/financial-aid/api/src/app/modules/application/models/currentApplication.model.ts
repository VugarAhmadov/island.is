import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  HomeCircumstances,
  ApplicationState,
  CurrentApplication,
} from '@island.is/financial-aid/shared'

@ObjectType()
export class CurrentApplicationModel implements CurrentApplication {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly homeCircumstances!: HomeCircumstances

  @Field()
  readonly usePersonalTaxCredit!: boolean

  @Field(() => String)
  readonly state!: ApplicationState
}

import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryCountryResidenceDays } from './nationalRegistryCountryResidenceDays.model'
import { NationalRegistryResidence } from './nationalRegistryResidence.model'

@ObjectType()
export class NationalRegistryResidenceHistory {
  @Field(() => ID)
  nationalId!: string

  @Field(() => [NationalRegistryResidence])
  history!: NationalRegistryResidence[]

  @Field(() => [NationalRegistryCountryResidenceDays], { nullable: true })
  countryResidenceDays?: NationalRegistryCountryResidenceDays[] | null
}

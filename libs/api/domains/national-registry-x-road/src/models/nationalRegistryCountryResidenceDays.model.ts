import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryCountryResidenceDays {
  @Field()
  countryCode!: string

  @Field()
  days!: number
}

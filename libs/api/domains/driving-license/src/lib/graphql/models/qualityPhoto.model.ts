import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class QualityPhoto {
  @Field()
  success!: boolean

  @Field({ nullable: true })
  qualityPhoto!: string | null
}

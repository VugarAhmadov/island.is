import { LawChapterSlug } from '@hugsmidjan/regulations-editor/types'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class GetRegulationsLawChaptersInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  tree?: boolean

  @Field(() => [String], { nullable: true })
  @IsOptional()
  slugs?: LawChapterSlug[]
}

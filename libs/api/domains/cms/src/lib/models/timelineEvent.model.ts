import { Field, ObjectType, ID, Int } from '@nestjs/graphql'

import { ITimelineEvent } from '../generated/contentfulTypes'
import { Html, mapHtml } from './html.model'

@ObjectType()
export class TimelineEvent {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  date: string

  @Field(() => Int, { nullable: true })
  numerator?: number

  @Field(() => Int, { nullable: true })
  denominator?: number

  @Field()
  label: string

  @Field(() => Html, { nullable: true })
  body?: Html

  @Field(() => [String], { nullable: true })
  tags?: Array<string>

  @Field()
  link: string
}

export const mapTimelineEvent = ({
  fields,
  sys,
}: ITimelineEvent): TimelineEvent => ({
  id: sys.id,
  title: fields.title ?? '',
  date: fields.date ?? '',
  numerator: fields.numerator ?? null,
  denominator: fields.denominator ?? null,
  label: fields.label ?? '',
  body: (fields.body && mapHtml(fields.body, sys.id + ':body')) ?? null,
  tags: fields.tags ?? [],
  link: fields.link ?? '',
})

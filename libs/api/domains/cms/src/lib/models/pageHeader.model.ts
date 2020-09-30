import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IPageHeader } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { TimelineSlice, mapTimelineSlice } from './timelineSlice.model'

@ObjectType()
export class PageHeader {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  introduction: string

  @Field()
  navigationText: string

  @Field(() => [Link])
  links: Link[]

  @Field(() => [TimelineSlice])
  slices: Array<TimelineSlice>
}

export const mapPageHeader = (entry: IPageHeader): PageHeader => {
  const fields = entry?.fields
  const sys = entry?.sys
  return {
    typename: 'PageHeader',
    id: sys?.id ?? '',
    title: fields?.title ?? '',
    introduction: fields?.introduction ?? '',
    navigationText: fields?.navigationText ?? '',
    links: (fields?.links ?? []).map(mapLink),
    slices: (fields?.slices ?? []).map(mapTimelineSlice),
  }
}

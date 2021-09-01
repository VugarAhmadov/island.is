import { createUnionType } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Document, BLOCKS, Block } from '@contentful/rich-text-types'
import { logger } from '@island.is/logging'
import {
  ITimeline,
  IMailingListSignup,
  ISectionHeading,
  ICardSection,
  IStorySection,
  ILogoListSlice,
  ILatestNewsSlice,
  IBigBulletList,
  IStatistics,
  IProcessEntry,
  IFaqList,
  ISliceConnectedComponent,
  IEmbeddedVideo,
  ISectionWithImage,
  ITabSection,
  ITeamList,
  IContactUs,
  ILocation,
  ITellUsAStory,
  IDistricts,
  IFeaturedArticles,
  IOneColumnText,
  ITwoColumnText,
  IMultipleStatistics,
  IAccordionSlice,
  IOverviewLinks,
  IEventSlice,
} from '../generated/contentfulTypes'
import { Image, mapImage } from '../models/image.model'
import { Asset, mapAsset } from '../models/asset.model'
import {
  MailingListSignupSlice,
  mapMailingListSignup,
} from '../models/mailingListSignupSlice.model'
import { mapTimelineSlice, TimelineSlice } from '../models/timelineSlice.model'
import { HeadingSlice, mapHeadingSlice } from '../models/headingSlice.model'
import { mapStorySlice, StorySlice } from '../models/storySlice.model'
import { LinkCardSlice, mapLinkCardSlice } from '../models/linkCardSlice.model'
import {
  LatestNewsSlice,
  mapLatestNewsSlice,
} from '../models/latestNewsSlice.model'
import { LogoListSlice, mapLogoListSlice } from '../models/logoListSlice.model'
import {
  BulletListSlice,
  mapBulletListSlice,
} from '../models/bulletListSlice.model'
import { mapStatistics, Statistics } from '../models/statistics.model'
import { Html, mapHtml } from '../models/html.model'
import { mapProcessEntry, ProcessEntry } from '../models/processEntry.model'
import { FaqList, mapFaqList } from '../models/faqList.model'
import {
  ConnectedComponent,
  mapConnectedComponent,
} from '../models/connectedComponent.model'
import { EmbeddedVideo, mapEmbeddedVideo } from '../models/embeddedVideo.model'
import {
  mapSectionWithImage,
  SectionWithImage,
} from '../models/sectionWithImage.model'
import { mapTabSection, TabSection } from '../models/tabSection.model'
import { mapTeamList, TeamList } from '../models/teamList.model'
import { ContactUs, mapContactUs } from '../models/contactUs.model'
import { Location, mapLocation } from '../models/location.model'
import { mapTellUsAStory, TellUsAStory } from '../models/tellUsAStory.model'
import { Districts, mapDistricts } from '../models/districts.model'
import {
  FeaturedArticles,
  mapFeaturedArticles,
} from '../models/featuredArticles.model'
import { mapTwoColumnText, TwoColumnText } from '../models/twoColumnText.model'
import { mapOneColumnText, OneColumnText } from '../models/oneColumnText.model'
import {
  AccordionSlice,
  mapAccordionSlice,
} from '../models/accordionSlice.model'
import { mapOverviewLinks, OverviewLinks } from '../models/overviewLinks.model'
import {
  mapMultipleStatistics,
  MultipleStatistics,
} from '../models/multipleStatistics.model'
import { EventSlice, mapEventSlice } from '../models/eventSlice.model'

type SliceTypes =
  | ITimeline
  | IMailingListSignup
  | ISectionHeading
  | ICardSection
  | IStorySection
  | ILogoListSlice
  | ILatestNewsSlice
  | IBigBulletList
  | IStatistics
  | IProcessEntry
  | IFaqList
  | ISliceConnectedComponent
  | IEmbeddedVideo
  | ISectionWithImage
  | ITabSection
  | ITeamList
  | IContactUs
  | ILocation
  | ITellUsAStory
  | IDistricts
  | IFeaturedArticles
  | IOneColumnText
  | ITwoColumnText
  | IMultipleStatistics
  | IAccordionSlice
  | IOverviewLinks
  | IEventSlice

export const SliceUnion = createUnionType({
  name: 'Slice',
  types: () => [
    TimelineSlice,
    MailingListSignupSlice,
    HeadingSlice,
    LinkCardSlice,
    StorySlice,
    LogoListSlice,
    LatestNewsSlice,
    BulletListSlice,
    Statistics,
    ProcessEntry,
    FaqList,
    ConnectedComponent,
    EmbeddedVideo,
    SectionWithImage,
    TabSection,
    TeamList,
    ContactUs,
    Location,
    TellUsAStory,
    Html,
    Image,
    Asset,
    Districts,
    FeaturedArticles,
    OneColumnText,
    TwoColumnText,
    MultipleStatistics,
    AccordionSlice,
    OverviewLinks,
    EventSlice,
  ],
  resolveType: (document) => document.typename, // typename is appended to request on indexing
})

export const mapSliceUnion = (slice: SliceTypes): typeof SliceUnion => {
  const contentType = slice.sys.contentType?.sys?.id
  switch (contentType) {
    case 'timeline':
      return mapTimelineSlice(slice as ITimeline)
    case 'mailingListSignup':
      return mapMailingListSignup(slice as IMailingListSignup)
    case 'sectionHeading':
      return mapHeadingSlice(slice as ISectionHeading)
    case 'cardSection':
      return mapLinkCardSlice(slice as ICardSection)
    case 'storySection':
      return mapStorySlice(slice as IStorySection)
    case 'logoListSlice':
      return mapLogoListSlice(slice as ILogoListSlice)
    case 'latestNewsSlice':
      return mapLatestNewsSlice(slice as ILatestNewsSlice)
    case 'bigBulletList':
      return mapBulletListSlice(slice as IBigBulletList)
    case 'statistics':
      return mapStatistics(slice as IStatistics)
    case 'processEntry':
      return mapProcessEntry(slice as IProcessEntry)
    case 'faqList':
      return mapFaqList(slice as IFaqList)
    case 'sliceConnectedComponent':
      return mapConnectedComponent(slice as ISliceConnectedComponent)
    case 'embeddedVideo':
      return mapEmbeddedVideo(slice as IEmbeddedVideo)
    case 'sectionWithImage':
      return mapSectionWithImage(slice as ISectionWithImage)
    case 'tabSection':
      return mapTabSection(slice as ITabSection)
    case 'teamList':
      return mapTeamList(slice as ITeamList)
    case 'contactUs':
      return mapContactUs(slice as IContactUs)
    case 'location':
      return mapLocation(slice as ILocation)
    case 'tellUsAStory':
      return mapTellUsAStory(slice as ITellUsAStory)
    case 'districts':
      return mapDistricts(slice as IDistricts)
    case 'featuredArticles':
      return mapFeaturedArticles(slice as IFeaturedArticles)
    case 'oneColumnText':
      return mapOneColumnText(slice as IOneColumnText)
    case 'twoColumnText':
      return mapTwoColumnText(slice as ITwoColumnText)
    case 'multipleStatistics':
      return mapMultipleStatistics(slice as IMultipleStatistics)
    case 'accordionSlice':
      return mapAccordionSlice(slice as IAccordionSlice)
    case 'overviewLinks':
      return mapOverviewLinks(slice as IOverviewLinks)
    case 'eventSlice':
      return mapEventSlice(slice as IEventSlice)
    default:
      throw new ApolloError(`Can not convert to slice: ${contentType}`)
  }
}

/*
if we add a slice that is not in mapper mapSlices fails for that slice.
we don't want a single slice to cause errors on a whole page so we fail them gracefully
this can e.g. happen when a developer is creating a new slice type and an editor publishes it by accident on a page
*/
export const safelyMapSliceUnion = (
  data: SliceTypes,
): typeof SliceUnion | null => {
  try {
    return mapSliceUnion(data)
  } catch (error) {
    logger.warn('Failed to map slice', { error: error.message })
    return null
  }
}

const isEmptyNode = (node: Block): boolean => {
  return (node?.content ?? []).every((child) => {
    return child.nodeType === 'text' && child.value === ''
  })
}

export const mapDocument = (
  document: Document,
  idPrefix: string,
): Array<typeof SliceUnion> => {
  const slices: Array<typeof SliceUnion | null> = []
  const docs = document?.content ?? []

  docs.forEach((block, index) => {
    switch (block.nodeType) {
      case BLOCKS.EMBEDDED_ENTRY:
        slices.push(safelyMapSliceUnion(block.data.target))
        break
      case BLOCKS.EMBEDDED_ASSET:
        if (block.data.target.fields?.file) {
          block.data.target.fields.file.details?.image
            ? slices.push(mapImage(block.data.target))
            : slices.push(mapAsset(block.data.target))
        }
        break
      default: {
        // ignore last empty paragraph because of this annoying bug:
        // https://github.com/contentful/rich-text/issues/101
        if (index === document.content.length - 1 && isEmptyNode(block)) return

        // either merge into previous html slice or create a new one
        const prev = slices[slices.length - 1]
        if (prev instanceof Html) {
          prev.document?.content.push(block)
        } else {
          slices.push(mapHtml(block, `${idPrefix}:${index}`))
        }
      }
    }
  })

  return slices.filter((slice): slice is typeof SliceUnion => Boolean(slice)) // filter out empty slices that failed mapping
}

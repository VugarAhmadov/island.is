/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { GET_OPEN_DATA_PAGE_QUERY, GET_CATEGORIES_QUERY } from '../queries'
import {
  GetOpenDataPageQuery,
  QueryGetOpenDataPageArgs,
  GetGroupedMenuQuery,
  QueryGetGroupedMenuArgs,
  GetArticleCategoriesQuery,
  QueryGetArticleCategoriesArgs,
  ContentLanguage,
} from '@island.is/web/graphql/schema'
import {
  GridContainer,
  Box,
  GridRow,
  GridColumn,
  Breadcrumbs,
  Text,
  Link,
  Button,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { Screen } from '@island.is/web/types'
import {
  Section,
  StatisticsCardsSection,
  DataLinkSection,
  SimpleLineChart,
  ChartsCard,
  SectionTitle,
  Header,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver } from '../../hooks/useLinkResolver'
import { Locale } from '@island.is/shared/types'
import { GET_GROUPED_MENU_QUERY } from '../queries/Menu'
import {
  formatMegaMenuCategoryLinks,
  formatMegaMenuLinks,
} from '@island.is/web/utils/processMenuData'
import * as styles from './OpenData.treat'
import { useMeasure } from 'react-use'
import cn from 'classnames'

interface OpenDataProps {
  page: GetOpenDataPageQuery['getOpenDataPage']
  megaMenuData
}

const OpenDataPage: Screen<OpenDataProps> = ({ page, megaMenuData }) => {
  const { linkResolver } = useLinkResolver()
  const {
    pageTitle,
    pageDescription,
    pageHeaderGraph,
    link,
    linkTitle,
    statisticsCardsSection,
    chartSectionTitle,
    graphCards,
    externalLinkCardSelection,
    externalLinkSectionTitle,
    externalLinkSectionDescription,
    externalLinkSectionImage,
  } = page
  const [ref, { width, height }] = useMeasure()
  return (
    <Box id="main-content" position="relative" style={{ overflow: 'hidden' }}>
      <Box background="blue100">
        <Header megaMenuData={megaMenuData} />
      </Box>
      <Section
        aria-labelledby="openDataHeroTitle"
        background="blue100"
        paddingBottom={6}
        paddingTop={4}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '5/12', '5/12']} paddingBottom={2}>
              <Box marginBottom={3}>
                <Breadcrumbs
                  items={[
                    {
                      title: 'Ísland.is',
                      href: '/',
                    },
                    {
                      title: 'Gagnatorg',
                    },
                  ]}
                  renderLink={(link) => {
                    return (
                      <NextLink {...linkResolver('opendatapage')} passHref>
                        {link}
                      </NextLink>
                    )
                  }}
                />
              </Box>
              <Text variant="h1" as="h1" paddingBottom={4}>
                {pageTitle}
              </Text>
              <Text paddingBottom={4}>{pageDescription}</Text>
              <Box display={'flex'} justifyContent="flexStart" marginTop={3}>
                <Link href={link} skipTab>
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    variant="text"
                    as="span"
                  >
                    {linkTitle}
                  </Button>
                </Link>
              </Box>
            </GridColumn>
            <GridColumn span={['12/12', '7/12', '7/12']}>
              <Box
                ref={ref}
                className={cn(styles.headerGraphWrapper, {
                  [styles.scroll]: width < 700,
                })}
              >
                <Box className={styles.headerGraphParent}>
                  <SimpleLineChart graphData={pageHeaderGraph} />
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Section>
      <Section aria-labelledby="factsCardsTitle" paddingBottom={8}>
        <StatisticsCardsSection
          title="Stafrænt Ísland"
          cards={statisticsCardsSection}
        />
      </Section>
      <Section paddingBottom={8}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <SectionTitle title={chartSectionTitle} icon="business" />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '4/12', '4/12']}>
              <ChartsCard chart={graphCards[1]} />
            </GridColumn>
            <GridColumn span={['12/12', '8/12', '8/12']}>
              <ChartsCard chart={graphCards[0]} />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Section>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        aria-labelledby="dataLinksSection"
      >
        <DataLinkSection
          title={externalLinkSectionTitle}
          titleId="OpenDataLinksTitle"
          image={externalLinkSectionImage}
          description={externalLinkSectionDescription}
          cards={externalLinkCardSelection.cards}
        />
      </Section>
    </Box>
  )
}

OpenDataPage.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOpenDataPage: page },
    },
    megaMenuData,
    categories,
  ] = await Promise.all([
    apolloClient.query<GetOpenDataPageQuery, QueryGetOpenDataPageArgs>({
      query: GET_OPEN_DATA_PAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetGroupedMenuQuery, QueryGetGroupedMenuArgs>({
        query: GET_GROUPED_MENU_QUERY,
        variables: {
          input: { id: '5prHB8HLyh4Y35LI4bnhh2', lang: locale },
        },
      })
      .then((res) => res.data.getGroupedMenu),
    apolloClient
      .query<GetArticleCategoriesQuery, QueryGetArticleCategoriesArgs>({
        query: GET_CATEGORIES_QUERY,
        variables: {
          input: {
            lang: locale,
          },
        },
      })
      .then((res) => res.data.getArticleCategories),
  ])

  const [asideTopLinksData, asideBottomLinksData] = megaMenuData.menus

  return {
    page,
    megaMenuData: {
      asideTopLinks: formatMegaMenuLinks(
        locale as Locale,
        asideTopLinksData.menuLinks,
      ),
      asideBottomTitle: asideBottomLinksData.title,
      asideBottomLinks: formatMegaMenuLinks(
        locale as Locale,
        asideBottomLinksData.menuLinks,
      ),
      mainLinks: formatMegaMenuCategoryLinks(locale as Locale, categories),
    },
  }
}

export default withMainLayout(OpenDataPage, {
  showHeader: false,
})

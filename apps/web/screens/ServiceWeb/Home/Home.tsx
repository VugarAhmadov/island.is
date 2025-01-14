import React from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Organization,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSupportCategoriesInOrganizationArgs,
  QueryGetSupportQnAsArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_QUERY,
  GET_SUPPORT_CATEGORIES,
  GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
} from '../../queries'
import { Screen } from '../../../types'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

import {
  Card,
  SimpleStackedSlider,
  ServiceWebSearchSection,
  ServiceWebHeader,
} from '@island.is/web/components'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'
import ContactBanner from '../ContactBanner/ContactBanner'

import * as styles from './Home.treat'
import * as sharedStyles from '../shared/styles.treat'

interface HomeProps {
  organization?: Organization
  namespace: Query['getNamespace']
  supportCategories:
    | Query['getSupportCategories']
    | Query['getSupportCategoriesInOrganization']
  slug: string
}

const Home: Screen<HomeProps> = ({ organization, supportCategories, slug }) => {
  const logoTitle =
    organization?.shortTitle ?? organization?.title ?? 'Ísland.is'

  const logoUrl =
    organization?.logo?.url ??
    '//images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'

  const searchTitle = 'Getum við aðstoðað?'

  return (
    <>
      <ServiceWebHeader hideSearch logoTitle={logoTitle} />
      <div className={sharedStyles.bg} />
      <Box className={styles.searchSection}>
        <ServiceWebSearchSection
          logoTitle={logoTitle}
          logoUrl={logoUrl}
          title={searchTitle}
        />
      </Box>
      <Box className={styles.categories}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingBottom={[2, 2, 3]}>
              <Text variant="h3" color="white">
                Svör eftir flokkum
              </Text>
            </GridColumn>
          </GridRow>
        </GridContainer>
        <SimpleStackedSlider
          itemWidth={280}
          span={['12/12', '6/12', '6/12', '4/12']}
        >
          {supportCategories.map(
            ({ title, slug, description, organization }, index) => {
              return (
                <Card
                  key={index}
                  title={title}
                  description={description}
                  link={
                    {
                      href: `/thjonustuvefur/${organization.slug}/${slug}`,
                    } as LinkResolverResponse
                  }
                />
              )
            },
          )}
        </SimpleStackedSlider>
      </Box>
      <Box marginY={[7, 10, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <Box marginY={[10, 10, 20]}>
                <ContactBanner slug={slug} />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug ? (query.slug as string) : 'stafraent-island'

  const [organization, namespace, supportCategories] = await Promise.all([
    !!slug &&
      apolloClient.query<Query, QueryGetOrganizationArgs>({
        query: GET_ORGANIZATION_QUERY,
        variables: {
          input: {
            slug,
            lang: locale as ContentLanguage,
          },
        },
      }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    slug
      ? apolloClient.query<Query, QueryGetSupportCategoriesInOrganizationArgs>({
          query: GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
          variables: {
            input: {
              lang: locale,
              slug: slug,
            },
          },
        })
      : apolloClient.query<Query, QueryGetSupportQnAsArgs>({
          query: GET_SUPPORT_CATEGORIES,
          variables: {
            input: {
              lang: locale,
            },
          },
        }),
  ])

  let processedCategories = slug
    ? supportCategories?.data?.getSupportCategoriesInOrganization
    : supportCategories?.data?.getSupportCategories

  // filter out categories that don't belong to an organization
  processedCategories = processedCategories.filter(
    (item) => !!item.organization,
  )

  return {
    organization: organization?.data?.getOrganization,
    namespace,
    supportCategories: processedCategories,
    slug,
  }
}

export default withMainLayout(Home, {
  showHeader: false,
})

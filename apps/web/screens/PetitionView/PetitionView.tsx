import React, { useState, useEffect } from 'react'
import { Text } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
  Table as T,
  Pagination,
} from '@island.is/island-ui/core'
import { ApplicationTypes, getSlugFromType } from '@island.is/application/core'
import { list } from './mocks'
import { PAGE_SIZE, pages, paginate } from './pagination'

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

const PetitionView = () => {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pagePetitions, setPetitions] = useState(list.signedPetitions)

  const handlePagination = (page, petitions) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    handlePagination(1, list.signedPetitions)
  }, [])

  return (
    <Box marginTop={5} marginBottom={5}>
      <GridContainer>
        <GridRow>
          <GridColumn span="10/12" offset="1/12">
            <GridRow>
              <GridColumn>
                <Text variant="h2" marginBottom={3}>
                  {list.title}
                </Text>
                <Text variant="default" marginBottom={3}>
                  {list.descritptionText}
                </Text>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <Text variant="h4">Undirskriftalistinn er opinn:</Text>
                <Text variant="default">{list.til}</Text>
              </GridColumn>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <Text variant="h4">Ábyrgðarmaður:</Text>
                <Text variant="default">{list.owner}</Text>
              </GridColumn>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <Text variant="h4">Fjöldi skráðir:</Text>
                <Text variant="default">{list.signedPetitions.length}</Text>
              </GridColumn>
            </GridRow>
            <GridRow marginTop={5}>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <Button
                  variant="primary"
                  icon="arrowForward"
                  onClick={() =>
                    window.open(
                      `${baseUrlForm}/${
                        getSlugFromType(
                          ApplicationTypes.GENERAL_PETITION,
                        ) as string
                      }/${'f7023b53-5593-414c-9721-ba059aaa5120'}`,
                    )
                  }
                >
                  Setja nafn mitt á þennan lista
                </Button>
              </GridColumn>
            </GridRow>
            <GridRow marginTop={5} marginBottom={5}>
              <GridColumn span={['12/12', '12/12', '12/12']}>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>Dags skráð</T.HeadData>
                      <T.HeadData>Nafn</T.HeadData>
                      <T.HeadData>Athugasemd</T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {pagePetitions.map((petition) => {
                      return (
                        <T.Row key={petition.kt}>
                          <T.Data>{petition.signed}</T.Data>
                          <T.Data>{petition.name}</T.Data>
                          <T.Data>{petition.athugasemd}</T.Data>
                        </T.Row>
                      )
                    })}
                  </T.Body>
                </T.Table>
              </GridColumn>
            </GridRow>
            {!!list.signedPetitions?.length && (
              <Box marginY={3}>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  renderLink={(page, className, children) => (
                    <Box
                      cursor="pointer"
                      className={className}
                      onClick={() =>
                        handlePagination(page, list.signedPetitions)
                      }
                    >
                      {children}
                    </Box>
                  )}
                />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default withMainLayout(PetitionView)

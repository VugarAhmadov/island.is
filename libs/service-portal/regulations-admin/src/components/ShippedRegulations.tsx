import React from 'react'

// import { gql, useQuery } from '@apollo/client'
// import { Query } from '@island.is/api/schema'
import { Box, Stack, Text, TopicCard } from '@island.is/island-ui/core'
import { mockShippedList, useMockQuery } from '../_mockData'
import { homeMessages as msg } from '../messages'
import { prettyName } from '@island.is/regulations'
import { useLocale } from '../utils'

// const ShippedRegulationsQuery = gql`
//   query ShippedRegulationsQuery {
//     shippedRegulations {
//       id
//       name
//       title
//       draftStatus
//       idealPublishDate
//     }
//   }
// `

export const ShippedRegulations = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const { data, loading } = useMockQuery({
    shippedRegulations: mockShippedList,
  }) // useQuery<Query>(ShippedRegulationsQuery)

  const { shippedRegulations = [] } = data || {}

  if (loading) {
    return null
  }

  return (
    <Box marginTop={[4, 4, 6]}>
      <Text variant="h2" as="h2" marginBottom={2}>
        {formatMessage(msg.shippedTitle)}
      </Text>
      <Stack space={1}>
        {shippedRegulations.map((shipped) => (
          <TopicCard
            key={shipped.id}
            tag={formatDateFns(shipped.idealPublishDate)}
            onClick={() => undefined}
          >
            {prettyName(shipped.name)} {shipped.title}
          </TopicCard>
        ))}
      </Stack>
    </Box>
  )
}
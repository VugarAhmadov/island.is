import React, { useContext, useMemo } from 'react'
import { Box, Text, Tag } from '@island.is/island-ui/core'

import { mapCaseStateToTagVariant } from './utils'
import {
  CaseDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import parseISO from 'date-fns/parseISO'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { Table } from '@island.is/judicial-system-web/src/shared-components'
import { insertAt } from '@island.is/judicial-system-web/src/utils/formatters'
import * as styles from './Requests.treat'

interface Props {
  cases: Case[]
  onRowClick: (id: string) => void
}

const PastRequests: React.FC<Props> = (props) => {
  const { cases, onRowClick } = props
  const sortableColumnIds = ['courtCaseNumber', 'accusedName', 'type']

  const { user } = useContext(UserContext)
  const isCourtRole =
    user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR

  const pastRequestsColumns = useMemo(
    () => [
      {
        Header: 'Málsnr. ',
        accessor: 'courtCaseNumber' as keyof Case,
        Cell: (row: {
          row: {
            original: { courtCaseNumber: string; policeCaseNumber: string }
          }
        }) => {
          return (
            <>
              <Box component="span" display="block">
                {row.row.original.courtCaseNumber}
              </Box>
              <Text as="span" variant="small">
                {row.row.original.policeCaseNumber}
              </Text>
            </>
          )
        },
      },
      {
        Header: 'Sakborningur',
        accessor: 'accusedName' as keyof Case,
        Cell: (row: {
          row: { original: { accusedName: string; accusedNationalId: string } }
        }) => {
          return (
            <>
              <Box component="span" display="block">
                {row.row.original.accusedName}
              </Box>
              <Text as="span" variant="small">
                {`kt. ${insertAt(
                  row.row.original.accusedNationalId.replace('-', ''),
                  '-',
                  6,
                )}`}
              </Text>
            </>
          )
        },
      },
      {
        Header: 'Tegund',
        accessor: 'type' as keyof Case,
        Cell: (row: {
          row: {
            original: {
              type: CaseType
              decision: CaseDecision
              parentCase: Case
            }
          }
        }) => {
          const thisRow = row.row.original

          return (
            <>
              <Box component="span" display="block">
                {thisRow.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                  ? capitalize(caseTypes['TRAVEL_BAN'])
                  : capitalize(caseTypes[thisRow.type])}
              </Box>
              {row.row.original.parentCase && (
                <Text as="span" variant="small">
                  Framlenging
                </Text>
              )}
            </>
          )
        },
      },
      {
        Header: 'Staða',
        accessor: 'state' as keyof Case,
        disableSortBy: true,
        Cell: (row: {
          row: {
            original: {
              state: CaseState
              isValidToDateInThePast: boolean
              type: CaseType
            }
          }
        }) => {
          const isInvestigationCase =
            row.row.original.type !== CaseType.CUSTODY &&
            row.row.original.type !== CaseType.TRAVEL_BAN

          const tagVariant = mapCaseStateToTagVariant(
            row.row.original.state,
            isCourtRole,
            isInvestigationCase,
            row.row.original.isValidToDateInThePast,
          )

          return (
            <Tag variant={tagVariant.color} outlined disabled>
              {tagVariant.text}
            </Tag>
          )
        },
      },
      {
        Header: 'Gildistími',
        accessor: 'rulingDate' as keyof Case,
        disableSortBy: true,
        Cell: (row: {
          row: {
            original: {
              rulingDate: string
              validToDate: string
              courtEndTime: string
              state: CaseState
            }
          }
        }) => {
          const rulingDate = row.row.original.rulingDate
          const validToDate = row.row.original.validToDate
          const courtEndDate = row.row.original.courtEndTime
          const state = row.row.original.state

          if (state === CaseState.REJECTED || !validToDate) {
            return null
          } else if (rulingDate) {
            return `${formatDate(parseISO(rulingDate), 'd.M.y')} - ${formatDate(
              parseISO(validToDate),
              'd.M.y',
            )}`
          } else if (courtEndDate) {
            return `${formatDate(
              parseISO(courtEndDate),
              'd.M.y',
            )} - ${formatDate(parseISO(validToDate), 'd.M.y')}`
          } else {
            return formatDate(parseISO(validToDate), 'd.M.y')
          }
        },
      },
    ],
    [isCourtRole],
  )

  const pastRequestsData = useMemo(() => cases, [cases])

  return (
    <Table
      columns={pastRequestsColumns}
      data={pastRequestsData ?? []}
      handleRowClick={onRowClick}
      className={styles.pastRequestsTable}
      sortableColumnIds={sortableColumnIds}
    />
  )
}

export default PastRequests

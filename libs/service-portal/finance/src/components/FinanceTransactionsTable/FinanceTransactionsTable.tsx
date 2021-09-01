import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { dateFormat } from '@island.is/shared/constants'
import amountFormat from '../../utils/amountFormat'
import { ExpandRow, ExpandHeader } from '../../components/ExpandableTable'
import { CustomerRecordsDetails } from '../../screens/FinanceTransactions/FinanceTransactionsData.types'
import FinanceTransactionsDetail from '../FinanceTransactionsDetail/FinanceTransactionsDetail'

const ITEMS_ON_PAGE = 20

interface Props {
  recordsArray: Array<CustomerRecordsDetails>
}

const FinanceTransactionsTable: FC<Props> = ({ recordsArray }) => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const totalPages =
    recordsArray.length > ITEMS_ON_PAGE
      ? Math.ceil(recordsArray.length / ITEMS_ON_PAGE)
      : 0
  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            { value: formatMessage(m.date) },
            { value: formatMessage(m.chargeType) },
            { value: formatMessage(m.feeItem) },
            { value: formatMessage(m.feeBase) },
            { value: formatMessage(m.period) },
            { value: formatMessage(m.amount), align: 'right' },
          ]}
        />
        <T.Body>
          {recordsArray
            .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
            .map((record) => (
              <ExpandRow
                key={`${record.createTime}-${record.referenceToLevy}`}
                data={[
                  { value: format(new Date(record.createDate), dateFormat.is) },
                  { value: record.chargeType },
                  { value: record.itemCode },
                  { value: record.chargeItemSubject },
                  { value: record.period },
                  { value: amountFormat(record.amount), align: 'right' },
                ]}
              >
                <FinanceTransactionsDetail
                  data={[
                    {
                      title: formatMessage(m.effectiveDate),
                      value: format(new Date(record.valueDate), dateFormat.is),
                    },
                    {
                      title: formatMessage(m.performingOrganization),
                      value: record.performingOrganization,
                    },
                    {
                      title: formatMessage(m.guardian),
                      value: record.collectingOrganization,
                    },
                    {
                      title: formatMessage(m.recordCategory),
                      value: record.category,
                    },
                    {
                      title: formatMessage(m.recordAction),
                      value: record.subCategory,
                    },
                    ...(record.actionCategory
                      ? [
                          {
                            title: formatMessage(m.actionCategory),
                            value: record.actionCategory,
                          },
                        ]
                      : []),
                    {
                      title: formatMessage(m.reference),
                      value: record.reference,
                    },
                  ]}
                />
              </ExpandRow>
            ))}
        </T.Body>
      </T.Table>
      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </>
  )
}

export default FinanceTransactionsTable

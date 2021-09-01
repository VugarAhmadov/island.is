import React from 'react'
import { ActionCard, Box, Text } from '@island.is/island-ui/core'

import * as styles from './Status.treat'

import format from 'date-fns/format'
import {
  ApplicationState,
  CurrentApplication,
  months,
  getState,
} from '@island.is/financial-aid/shared'
import {
  Timeline,
  Estimation,
} from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

interface Props {
  currentApplication: CurrentApplication
}

const InProgress = ({ currentApplication }: Props) => {
  const router = useRouter()

  const nextMonth = parseInt(format(new Date(), 'MM'))
  const currentYear = format(new Date(), 'yyyy')

  return (
    <>
      <Text as="h2" variant="h3" color="blue400" marginBottom={[4, 4, 7]}>
        Umsókn {getState[currentApplication.state].toLowerCase()} til útgreiðslu
        í {months[nextMonth].toLowerCase()} {` `} {currentYear}
      </Text>

      {currentApplication.state === ApplicationState.DATANEEDED && (
        <Box marginBottom={[4, 4, 7]}>
          <ActionCard
            heading="Vantar gögn"
            text="Við þurfum að fá gögn frá þér áður en við getum haldið áfram með umsóknina."
            cta={{
              label: 'Hlaða upp gögnum',
              onClick: () => {
                router.push(`${router.query.id}/gogn`)
              },
            }}
            backgroundColor="blue"
          />
        </Box>
      )}

      <Timeline state={currentApplication.state} />

      <Estimation
        homeCircumstances={currentApplication.homeCircumstances}
        usePersonalTaxCredit={currentApplication?.usePersonalTaxCredit}
        aboutText={
          <Text marginBottom={[2, 2, 3]}>
            Athugaðu að þessi útreikningur er{' '}
            <span className={styles.taxReturn}>
              eingöngu til viðmiðunar og getur tekið breytingum.
            </span>{' '}
            Þú færð skilaboð þegar frekari útreikningur liggur fyrir. Niðurstaða
            umsóknar þinnar ætti að liggja fyrir innan X virkra daga.
          </Text>
        }
      />
    </>
  )
}

export default InProgress

import React from 'react'
import { ModalBase, Text, Box } from '@island.is/island-ui/core'

import * as styles from './AidAmountModal.treat'

import { Button } from '@island.is/financial-aid-web/veita/src/components'

import format from 'date-fns/format'

import {
  calculateAidFinalAmount,
  calulatePersonalTaxAllowanceUsed,
  calulateTaxOfAmount,
} from '@island.is/financial-aid/shared'

interface Props {
  aidAmount: number
  usePersonalTaxCredit: boolean
  isVisible: boolean
  onVisiblityChange: React.Dispatch<React.SetStateAction<boolean>>
}

const AidAmountModal = ({
  aidAmount,
  usePersonalTaxCredit,
  isVisible,
  onVisiblityChange,
}: Props) => {
  const currentYear = format(new Date(), 'yyyy')

  const calculation = [
    {
      title: 'Grunnupphæð',
      calculation: `+ ${aidAmount?.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Skattur',
      calculation: `- ${calulateTaxOfAmount(
        aidAmount,
        currentYear,
      ).toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Persónuafsláttur',
      calculation: `${
        usePersonalTaxCredit ? '+ ' : ''
      }${calulatePersonalTaxAllowanceUsed(
        aidAmount,
        usePersonalTaxCredit,
        currentYear,
      ).toLocaleString('de-DE')} kr. `,
    },
  ]

  const estimatedCalc = `${calculateAidFinalAmount(
    aidAmount,
    Boolean(usePersonalTaxCredit),
    currentYear,
  ).toLocaleString('de-DE')} kr.`

  const closeModal = (): void => {
    onVisiblityChange(false)
  }

  return (
    <ModalBase
      baseId="changeStatus"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisiblityChange(visibility)
        }
      }}
      className={styles.modalBase}
    >
      <Box onClick={closeModal} className={styles.modalContainer}>
        <Box
          position="relative"
          borderRadius="large"
          overflow="hidden"
          background="white"
          className={styles.modal}
        >
          <Text variant="h3" marginBottom={4}>
            Áætluð aðstoð
          </Text>

          {calculation.map((item, index) => (
            <span key={'calculation-' + index}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                paddingY={2}
                paddingX={3}
                borderTopWidth="standard"
                borderColor="blue200"
              >
                <Text variant="small">{item.title}</Text>
                <Text>{item.calculation}</Text>
              </Box>
            </span>
          ))}

          <Box
            display="flex"
            justifyContent="spaceBetween"
            background="blue100"
            borderTopWidth="standard"
            borderBottomWidth="standard"
            borderColor="blue200"
            paddingY={2}
            paddingX={3}
            marginBottom={4}
          >
            <Text variant="small">Áætluð aðstoð (hámark)</Text>
            <Text>{estimatedCalc}</Text>
          </Box>

          <Box display="flex" justifyContent="flexEnd" onClick={closeModal}>
            <Button>Loka</Button>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default AidAmountModal

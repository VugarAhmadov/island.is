import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'
import DefendantInfo from '../../SharedComponents/DefendantInfo/DefendantInfo'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const DefendantForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Varnaraðili
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Málsnúmer lögreglu
          </Text>
        </Box>
        <LokeCaseNumber
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          policeCaseNumberErrorMessage={'' /**TODO */}
        />
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Varnaraðili
          </Text>
        </Box>
        <DefendantInfo
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
        />
      </Box>
    </FormContentContainer>
  )
}

export default DefendantForm
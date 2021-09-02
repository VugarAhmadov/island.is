import React from 'react'
import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import type { Case } from '@island.is/judicial-system/types'
import { ValueType } from 'react-select'
import { Option } from '@island.is/island-ui/core'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
}

const SelectProsecutor: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, prosecutors } = props
  const { updateCase } = useCase()

  const defaultProsecutor = prosecutors?.find(
    (prosecutor: Option) => prosecutor.value === workingCase.prosecutor?.id,
  )
  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {`Ákærandi `}
          <Box component="span" data-testid="prosecutor-tooltip">
            <Tooltip text="Sá saksóknari sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis." />
          </Box>
        </Text>
      </Box>
      <Select
        name="prosecutor"
        label="Veldu saksóknara"
        defaultValue={defaultProsecutor}
        options={prosecutors}
        onChange={(selectedOption: ValueType<ReactSelectOption>) =>
          setAndSendToServer(
            'prosecutorId',
            (selectedOption as ReactSelectOption).value.toString(),
            workingCase,
            setWorkingCase,
            updateCase,
          )
        }
        required
      />
    </>
  )
}

export default SelectProsecutor

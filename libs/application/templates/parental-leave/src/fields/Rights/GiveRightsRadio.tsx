import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  RadioField,
} from '@island.is/application/core'
import { RadioFormField } from '@island.is/application/ui-fields'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { NO, YES } from '../../constants'
import { maxDaysToGiveOrReceive } from '../../config'
import { YesOrNo } from '../../types'

interface GiveRightsRadioProps extends FieldBaseProps {
  field: RadioField
}

const GiveRightsRadio = ({ field, application }: GiveRightsRadioProps) => {
  const { register } = useFormContext()
  const [radio, setRadio] = useState<YesOrNo | undefined>(undefined)

  return (
    <>
      <RadioFormField
        application={application}
        field={{
          id: `${field.id}.isGivingRights`,
          title: field.title,
          description: field.description,
          type: FieldTypes.RADIO,
          children: undefined,
          component: FieldComponents.RADIO,
          width: 'half',
          onSelect: (value: string) => setRadio(value as YesOrNo),
          options: [
            {
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              value: NO,
            },
          ],
        }}
      />

      <input
        ref={register}
        type="hidden"
        value={radio === YES ? maxDaysToGiveOrReceive : 0}
        name={`${field.id}.giveDays`}
      />
    </>
  )
}

export default GiveRightsRadio

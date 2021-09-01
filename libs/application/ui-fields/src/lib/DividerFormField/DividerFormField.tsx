import React, { FC } from 'react'

import {
  DividerField,
  formatText,
  Application,
} from '@island.is/application/core'
import { Box, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const DividerFormField: FC<{
  field: DividerField
  application: Application
}> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  if (field.title) {
    return (
      <Box marginTop={5} marginBottom={1}>
        <Text variant="h5" color={field.color ?? 'blue400'}>
          {formatText(field.title, application, formatMessage)}
        </Text>
      </Box>
    )
  }

  return (
    <Box paddingTop={2} paddingBottom={2}>
      <Divider />
    </Box>
  )
}

import { Box, Bullet, BulletList, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { FileType } from '../../types'

interface ValueLineProps {
  label: string | MessageDescriptor
  value: string | MessageDescriptor
  color?: Colors
}

export const ValueLine: FC<ValueLineProps> = ({ label, value, color }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={3}>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text color={color}>{formatMessage(value)}</Text>
    </Box>
  )
}

interface FileValueLineProps {
  label: string | MessageDescriptor
  files: FileType[] | undefined
}

export const FileValueLine: FC<FileValueLineProps> = ({ label, files }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={2} paddingBottom={!files || files.length === 0 ? 0 : 2}>
      <Text variant="h5" marginBottom={[2, 2, 3]}>
        {formatMessage(label)}
      </Text>
      {!files || files.length === 0 ? null : (
        <BulletList space={1} type="ul">
          {files?.map((file, index) => (
            <Bullet key={`${file.name}-${index}`}>{file.name}</Bullet>
          ))}
        </BulletList>
      )}
    </Box>
  )
}

import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import React from 'react'

export const SubmittedOverviewPreview = ({ application }: FieldBaseProps) => {
  console.log(application)

  return (
    <>
      <Text>Yes, hello</Text>
      <Text>It's me again..</Text>
    </>
  )
}

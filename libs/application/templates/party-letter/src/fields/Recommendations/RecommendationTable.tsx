import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { Signature } from '../../types'
import { Box, Table as T, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface RecommendationProps {
  application: Application
  signatures?: Signature[]
}

const RecommendationTable: FC<RecommendationProps> = ({ signatures }) => {
  const { formatMessage } = useLocale()
  const renderRow = (signature: Signature, index: number) => {
    const cell = Object.entries(signature)
    return (
      <T.Row key={index}>
        {cell.map(([_key, value], i) => {
          if (typeof value === 'string') {
            return (
              <T.Data
                key={i}
                box={{
                  background: signature.hasWarning ? 'yellow200' : 'white',
                  textAlign: value === signature.address ? 'right' : 'left',
                }}
              >
                {signature.hasWarning && value === signature.address ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flexEnd"
                  >
                    {value}
                    <Box marginLeft={2}>
                      <Tooltip
                        color="yellow600"
                        iconSize="medium"
                        text={formatMessage(
                          m.validationMessages.signatureInvalid,
                        )}
                      />
                    </Box>
                  </Box>
                ) : (
                  value
                )}
              </T.Data>
            )
          } else {
            return null
          }
        })}
      </T.Row>
    )
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>Dags skráðkóli</T.HeadData>
          <T.HeadData>Nafn</T.HeadData>
          <T.HeadData>Kennitala</T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>Heimilisfang</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {signatures &&
          signatures.length &&
          signatures.map((signature, index) => renderRow(signature, index))}
      </T.Body>
    </T.Table>
  )
}

export default RecommendationTable
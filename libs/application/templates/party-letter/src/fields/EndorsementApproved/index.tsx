import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Approved } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'

const EndorsementApproved = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginTop={5} marginBottom={12}>
        <Approved
          title={formatMessage(m.endorsementApproved.cardTitle)}
          subtitle={formatMessage(m.endorsementApproved.cardSubtitle)}
        />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        {/* todo: add actions/links */}
        <Button variant="ghost">
          {formatMessage(m.endorsementApproved.myPagesButton)}
        </Button>
        <Box>
          <Button variant="text" icon="arrowForward" iconType="filled">
            {formatMessage(m.endorsementApproved.partyListButton)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default EndorsementApproved
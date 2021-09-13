import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Box, ActionCard, Table as T } from '@island.is/island-ui/core'
import { Fasteign } from '../../types/RealEstateAssets.types'

interface Props {
  assets?: Fasteign[]
}

const AssetListCards: FC<Props> = ({ assets }) => {
  const history = useHistory()
  return (
    <Box>
      {assets?.map((asset, i) => (
        <Box key={asset.fasteignanr} marginTop={i > 0 ? 4 : undefined}>
          <ActionCard
            heading={asset.sjalfgefidStadfang.display}
            text={asset.fasteignanr as string}
            cta={{
              label: 'Skoða nánar',
              variant: 'text',
              onClick: () =>
                history.push(
                  ServicePortalPath.AssetsRealEstateDetail.replace(
                    ':id',
                    asset.fasteignanr as string,
                  ),
                ),
            }}
          />
        </Box>
      ))}
    </Box>
  )
}

export default AssetListCards

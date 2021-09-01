import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const AssetsVehicles: ServicePortalModuleComponent = () => {
  useNamespaces(['service.portal', 'sp.assets'])

  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.assets:vehicles-title',
        defaultMessage: 'Ökutæki',
      })}
      intro={defineMessage({
        id: 'sp.assets:vehicles-intro',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir
        ökutæki á næstunni.`,
      })}
      list={{
        title: m.incoming,
        items: [
          defineMessage({
            id: 'sp.assets:vehicles-inc-1',
            defaultMessage:
              'Yfirlit og hægt verður að greiða öll opinber gjöld',
          }),
          defineMessage({
            id: 'sp.assets:vehicles-inc-2',
            defaultMessage: 'Ganga frá skattskýrsla og sjá eldi skattskýrslur',
          }),
          defineMessage({
            id: 'sp.assets:vehicles-inc-3',
            defaultMessage: 'Sjá yfirlit og ráðstafa séreignarsparnaði',
          }),
        ],
      }}
      externalHref="https://mitt.samgongustofa.is/"
      externalLinkTitle={defineMessage({
        id: 'sp.assets:vehicles-external-link-title',
        defaultMessage: 'Fara á ökutækjaskrá',
      })}
      inProgress={false}
      figure="./assets/images/movingTruck.svg"
    />
  )
}

export default AssetsVehicles

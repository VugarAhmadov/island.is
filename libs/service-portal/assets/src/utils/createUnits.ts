import chunk from 'lodash/chunk'
import { format as formatKennitala } from 'kennitala'
import amountFormat from './amountFormat'
import { messages } from '../lib/messages'
import { FormatMessage } from '@island.is/application/core'

import { Fasteign, Notkunareining } from '../types/RealEstateAssets.types'

const ownersArray = (data: Fasteign) => {
  const ownerArray = data?.thinglystirEigendur?.data?.map((owner) => {
    return [
      owner.nafn || '',
      formatKennitala(owner.kennitala) || '',
      owner.heimildBirting || '',
      owner.eignarhlutfall || '',
      '-',
    ]
  })
  return ownerArray && ownerArray.length > 0 ? ownerArray : [[]]
}

const unitsArray = (data: Fasteign, formatMessage: FormatMessage) =>
  data?.notkunareiningar?.data?.map((unit: Notkunareining) => {
    return {
      header: {
        title: formatMessage(messages.housing),
        value: unit.stadfang?.birting || '',
      },
      rows: chunk(
        [
          {
            title: formatMessage(messages.unitsOfUse),
            value: unit.notkunareininganumer || '',
          },
          {
            title: formatMessage(messages.currentAppraisal),
            value: unit.fasteignamat?.gildandiFasteignamat
              ? amountFormat(unit.fasteignamat.gildandiFasteignamat)
              : '',
          },
          {
            title: formatMessage(messages.location),
            value: unit.stadfang?.birtingStutt || '',
          },
          {
            title: `${formatMessage(messages.futureAppraisal)} ${
              unit.fasteignamat.fyrirhugadAr
            }`,
            value: unit.fasteignamat.fyrirhugadFasteignamat
              ? amountFormat(unit.fasteignamat.fyrirhugadFasteignamat)
              : '',
          },
          {
            title: formatMessage(messages.marking),
            value: unit.merking || '',
          },
          // {
          //   title: 'Húsmat',
          //   value: unit.husmat?! || '',
          // },
          {
            title: formatMessage(messages.municipality),
            value: unit.stadfang?.sveitarfelag || '',
          },
          {
            title: formatMessage(messages.siteAssessment),
            value: unit.lodarmat ? amountFormat(unit.lodarmat) : '',
          },
          {
            title: formatMessage(messages.usage),
            value: unit.notkunBirting || '',
          },
          {
            title: formatMessage(messages.fireCompAssessment),
            value: unit.brunabotamat ? amountFormat(unit.brunabotamat) : '',
          },
          {
            title: formatMessage(messages.operation),
            value: unit.starfsemi || '',
          },
        ],
        2,
      ),
    }
  })

export { unitsArray, ownersArray }

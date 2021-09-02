import {
  capitalize,
  formatAccusedByGender,
} from '@island.is/judicial-system/formatters'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'
import type { CaseGender } from '@island.is/judicial-system/types'
import { restrictions as m } from '@island.is/judicial-system-web/messages'

export const restrictions = [
  {
    title: 'B - Einangrun',
    id: CaseCustodyRestrictions.ISOLATION,
    info: m[CaseCustodyRestrictions.ISOLATION],
  },
  {
    title: 'C - Heimsóknarbann',
    id: CaseCustodyRestrictions.VISITAION,
    info: m[CaseCustodyRestrictions.VISITAION],
  },
  {
    title: 'D - Bréfskoðun, símabann',
    id: CaseCustodyRestrictions.COMMUNICATION,
    info: m[CaseCustodyRestrictions.COMMUNICATION],
  },
  {
    title: 'E - Fjölmiðlabann',
    id: CaseCustodyRestrictions.MEDIA,
    info: m[CaseCustodyRestrictions.MEDIA],
  },
]

export const judgeRestrictions = restrictions.filter(
  (provision) => provision.id !== CaseCustodyRestrictions.ISOLATION,
)

export const isolation = (accusedGender?: CaseGender) =>
  restrictions
    .filter((provision) => provision.id === CaseCustodyRestrictions.ISOLATION)
    .map((provision) => {
      return {
        ...provision,
        title: `${capitalize(
          formatAccusedByGender(accusedGender),
        )} skal sæta einangrun`,
      }
    })

export const alternativeTravelBanRestrictions = [
  {
    title: 'Tilkynningarskylda',
    id: CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
    info:
      m[CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION],
  },
  {
    title: 'Afhending vegabréfs',
    id: CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
    info: m[CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT],
  },
]

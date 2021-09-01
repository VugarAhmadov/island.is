import {
  AppealDecisionRole,
  RequiredField,
} from '@island.is/judicial-system-web/src/types'
import { TagVariant } from '@island.is/island-ui/core'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseGender,
  CaseType,
} from '@island.is/judicial-system/types'
import { validate } from './validate'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'

export const getAppealDecisionText = (
  role: AppealDecisionRole,
  appealDecision?: CaseAppealDecision,
  accusedGender?: CaseGender,
  caseType?: CaseType,
) => {
  switch (appealDecision) {
    case CaseAppealDecision.APPEAL: {
      return `${
        role === AppealDecisionRole.ACCUSED
          ? caseType === CaseType.CUSTODY || caseType === CaseType.TRAVEL_BAN
            ? capitalize(formatAccusedByGender(accusedGender))
            : 'Varnaraðili'
          : 'Sækjandi'
      } kærir úrskurðinn`
    }
    case CaseAppealDecision.ACCEPT: {
      return `${
        role === AppealDecisionRole.ACCUSED
          ? caseType === CaseType.CUSTODY || caseType === CaseType.TRAVEL_BAN
            ? capitalize(formatAccusedByGender(accusedGender))
            : 'Varnaraðili'
          : 'Sækjandi'
      } unir úrskurðinum`
    }
    case CaseAppealDecision.POSTPONE: {
      return `${
        role === AppealDecisionRole.ACCUSED
          ? caseType === CaseType.CUSTODY || caseType === CaseType.TRAVEL_BAN
            ? capitalize(formatAccusedByGender(accusedGender))
            : 'Varnaraðili'
          : 'Sækjandi'
      } tekur sér lögboðinn frest`
    }
    default: {
      return ''
    }
  }
}

export const isNextDisabled = (requiredFields: RequiredField[]) => {
  // Loop through requiredFields
  for (let i = 0; i < requiredFields.length; i++) {
    // Loop through validations for each required field
    for (let a = 0; a < requiredFields[i].validations.length; a++) {
      if (
        !validate(requiredFields[i].value, requiredFields[i].validations[a])
          .isValid
      ) {
        return true
      }
    }
  }
  return false
}

/**
 * A value is considered dirty if it's a string, either an empty string or not.
 * On the contrary a value is pristine if it's undefined or null.
 * @param value check if this value is dirty
 */
export const isDirty = (value?: string | null): boolean => {
  return typeof value === 'string'
}

export const getShortGender = (gender?: CaseGender): string => {
  switch (gender) {
    case CaseGender.MALE: {
      return 'kk'
    }
    case CaseGender.FEMALE: {
      return 'kvk'
    }
    case CaseGender.OTHER: {
      return 'annað'
    }
    default: {
      return ''
    }
  }
}

export const getRestrictionTagVariant = (
  restriction: CaseCustodyRestrictions,
): TagVariant => {
  switch (restriction) {
    case CaseCustodyRestrictions.COMMUNICATION:
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT: {
      return 'rose'
    }
    case CaseCustodyRestrictions.ISOLATION: {
      return 'red'
    }
    case CaseCustodyRestrictions.MEDIA:
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION: {
      return 'blueberry'
    }
    case CaseCustodyRestrictions.VISITAION: {
      return 'purple'
    }
    default: {
      return 'darkerBlue'
    }
  }
}

export const kb = (bytes?: number) => {
  return bytes ? Math.ceil(bytes / 1024) : ''
}

export const getAppealEndDate = (rulingDate: string) => {
  const rulingDateToDate = parseISO(rulingDate)
  const appealEndDate = addDays(rulingDateToDate, 3)
  return formatDate(appealEndDate, 'PPPp')
}

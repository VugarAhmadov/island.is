import { format, parseISO, isValid } from 'date-fns' // eslint-disable-line no-restricted-imports
// Importing 'is' directly from date-fns/locale/is has caused unexpected problems
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseType,
} from '@island.is/judicial-system/types'

const getAsDate = (date: Date | string | undefined | null): Date => {
  if (typeof date === 'string' || date instanceof String) {
    return parseISO(date as string)
  } else {
    return date as Date
  }
}

export function formatDate(
  date: Date | string | undefined,
  formatPattern: string,
  shortenDayName?: boolean,
): string | undefined {
  const theDate: Date = getAsDate(date)

  if (isValid(theDate)) {
    const formattedDate = format(theDate, formatPattern, {
      locale: is,
    })

    if (shortenDayName) {
      return formattedDate.replace('dagur,', 'd.')
    } else {
      return formattedDate
    }
  } else {
    return undefined
  }
}

// Credit: https://dzone.com/articles/capitalize-first-letter-string-javascript
export const capitalize = (text: string): string => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatNationalId = (nationalId: string): string => {
  if (nationalId?.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

export const laws = {
  _95_1_A: 'a-lið 1. mgr. 95. gr.',
  _95_1_B: 'b-lið 1. mgr. 95. gr.',
  _95_1_C: 'c-lið 1. mgr. 95. gr.',
  _95_1_D: 'd-lið 1. mgr. 95. gr.',
  _95_2: '2. mgr. 95. gr.',
  _97_3: '3. mgr. 97. gr.',
  _98_2: '2. mgr. 98. gr.',
  _99_1_B: 'b-lið 1. mgr. 99. gr.',
  _100_1: '1. mgr. 100. gr. sml.',
  _115_1: '1. mgr. 115. gr. útll.',
}

export const caseTypes = {
  CUSTODY: 'gæsluvarðhald',
  TRAVEL_BAN: 'farbann',
  SEARCH_WARRANT: 'húsleit',
  BANKING_SECRECY_WAIVER: 'rof bankaleyndar',
  PHONE_TAPPING: 'símhlustun',
  TELECOMMUNICATIONS: 'upplýsingar um fjarskiptasamskipti',
  TRACKING_EQUIPMENT: 'eftirfararbúnaður',
  PSYCHIATRIC_EXAMINATION: 'geðrannsókn',
  SOUND_RECORDING_EQUIPMENT: 'hljóðupptökubúnaði komið fyrir',
  AUTOPSY: 'krufning',
  BODY_SEARCH: 'leit og líkamsrannsókn',
  INTERNET_USAGE: 'upplýsingar um vefnotkun',
  OTHER: 'annað',
}

const getRestrictionByValue = (value: CaseCustodyRestrictions) => {
  switch (value) {
    case CaseCustodyRestrictions.COMMUNICATION:
      return 'D - Bréfskoðun, símabann'
    case CaseCustodyRestrictions.ISOLATION:
      return 'B - Einangrun'
    case CaseCustodyRestrictions.MEDIA:
      return 'E - Fjölmiðlabann'
    case CaseCustodyRestrictions.VISITAION:
      return 'C - Heimsóknarbann'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION:
      return 'Tilkynningaskylda'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT:
      return 'Afhending vegabréfs'
  }
}

export const getShortRestrictionByValue = (value: CaseCustodyRestrictions) => {
  switch (value) {
    case CaseCustodyRestrictions.COMMUNICATION:
      return 'Bréfskoðun, símabann'
    case CaseCustodyRestrictions.ISOLATION:
      return 'Einangrun'
    case CaseCustodyRestrictions.MEDIA:
      return 'Fjölmiðlabann'
    case CaseCustodyRestrictions.VISITAION:
      return 'Heimsóknarbann'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION:
      return 'Tilkynningarskylda'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT:
      return 'Afhending vegabréfs'
  }
}

export enum NounCases {
  NOMINATIVE, // Nefnifall
  ACCUSATIVE, // Þolfall
  DATIVE, // Þágufall
  GENITIVE, // Eignarfall
}

export function formatAccusedByGender(
  accusedGender?: CaseGender,
  nounCase: NounCases = NounCases.NOMINATIVE,
  isInvestigationCase?: boolean,
) {
  if (isInvestigationCase) {
    return nounCase === NounCases.NOMINATIVE ? 'varnaraðili' : 'varnaraðila'
  } else {
    switch (accusedGender) {
      case CaseGender.MALE:
        return nounCase === NounCases.NOMINATIVE ? 'kærði' : 'kærða'
      case CaseGender.FEMALE:
        return nounCase === NounCases.NOMINATIVE ? 'kærða' : 'kærðu'
      case CaseGender.OTHER:
      default:
        return 'kærða'
    }
  }
}

// Formats the restrictions set by the judge
// Note that only the predetermined list of restrictions is relevant here
export function formatCustodyRestrictions(
  accusedGender?: CaseGender,
  custodyRestrictions?: CaseCustodyRestrictions[],
  validToDate?: Date | string | undefined,
  isolationToDate?: Date | string | undefined,
): string {
  const relevantCustodyRestrictions = custodyRestrictions?.filter(
    (restriction) =>
      [
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.MEDIA,
      ].includes(restriction),
  )

  if (
    !(relevantCustodyRestrictions && relevantCustodyRestrictions.length > 0)
  ) {
    return 'Sækjandi tekur fram að gæsluvarðhaldið sé án takmarkana.'
  }

  const formattedValidToDateAndTime = `${formatDate(validToDate, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}`

  const formattedIsolationToDateAndTime = `${formatDate(
    isolationToDate,
    'PPPPp',
  )
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}`

  const isolationIsSameAsValidToDate =
    validToDate &&
    isolationToDate &&
    formattedIsolationToDateAndTime === formattedValidToDateAndTime

  let res = 'Sækjandi tekur fram að '

  if (relevantCustodyRestrictions.includes(CaseCustodyRestrictions.ISOLATION)) {
    res += `${formatAccusedByGender(accusedGender)} skuli sæta einangrun ${
      isolationIsSameAsValidToDate
        ? 'á meðan á gæsluvarðhaldinu stendur'
        : `ekki lengur en til ${formattedIsolationToDateAndTime}`
    }`

    if (relevantCustodyRestrictions.length === 1) {
      return res + '.'
    }

    res += ' og að '
  }

  const filteredCustodyRestrictions = relevantCustodyRestrictions
    .filter(
      (custodyRestriction) =>
        custodyRestriction !== CaseCustodyRestrictions.ISOLATION,
    )
    .sort()

  const filteredCustodyRestrictionsAsString = filteredCustodyRestrictions.reduce(
    (res, custodyRestriction, index) => {
      const isNextLast = index === filteredCustodyRestrictions.length - 2
      const isLast = index === filteredCustodyRestrictions.length - 1
      const isOnly = filteredCustodyRestrictions.length === 1

      return (res +=
        custodyRestriction === CaseCustodyRestrictions.COMMUNICATION
          ? `bréfaskoðun og símabanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : custodyRestriction === CaseCustodyRestrictions.MEDIA
          ? `fjölmiðlabanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : custodyRestriction === CaseCustodyRestrictions.VISITAION
          ? `heimsóknarbanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : '')
    },
    '',
  )

  return `${res}gæsluvarðhaldið verði með ${filteredCustodyRestrictionsAsString}skv. 99. gr. laga nr. 88/2008.`
}

// Fromats the restrictions set by the judge when choosing alternative travle ban
export const formatAlternativeTravelBanRestrictions = (
  accusedGender?: CaseGender,
  custodyRestrictions?: CaseCustodyRestrictions[],
  otherRestrictions?: string,
): string => {
  const relevantCustodyRestrictions = custodyRestrictions?.filter(
    (restriction) =>
      [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
      ].includes(restriction),
  )

  const hasTravelBanRestrictions =
    relevantCustodyRestrictions && relevantCustodyRestrictions?.length > 0
  const hasOtherRestrictions = otherRestrictions && otherRestrictions.length > 0

  // No restrictions
  if (!hasTravelBanRestrictions && !hasOtherRestrictions) {
    return 'Sækjandi tekur fram að farbannið sé án takmarkana.'
  }

  const accusedGenderText = formatAccusedByGender(
    accusedGender,
    NounCases.DATIVE,
  )

  const travelBanRestrictionsText = hasTravelBanRestrictions
    ? `Sækjandi tekur fram að farbannið verði með takmörkunum.${
        relevantCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        )
          ? ` Að ${accusedGenderText} verði gert að tilkynna sig.`
          : ''
      }${
        relevantCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
        )
          ? ` Að ${accusedGenderText} verði gert að afhenda vegabréfið sitt.`
          : ''
      }`
    : ''

  const paragraphBreak =
    hasTravelBanRestrictions && hasOtherRestrictions ? '\n' : ''

  const otherRestrictionsText = hasOtherRestrictions ? otherRestrictions : ''

  return `${travelBanRestrictionsText}${paragraphBreak}${otherRestrictionsText}`
}

// Formats the requested restrictions from the prosecutor
export const formatRequestedCustodyRestrictions = (
  type: CaseType,
  requestedCustodyRestrictions?: CaseCustodyRestrictions[],
  requestedOtherRestrictions?: string,
) => {
  const hasRequestedCustodyRestrictions =
    requestedCustodyRestrictions && requestedCustodyRestrictions?.length > 0
  const hasRequestedOtherRestrictions =
    requestedOtherRestrictions && requestedOtherRestrictions?.length > 0

  // No restrictions
  if (!hasRequestedCustodyRestrictions && !hasRequestedOtherRestrictions) {
    return `Ekki er farið fram á takmarkanir á ${
      type === CaseType.CUSTODY ? 'gæslu' : 'farbanni'
    }.`
  }

  const requestedCustodyRestrictionsText = hasRequestedCustodyRestrictions
    ? requestedCustodyRestrictions &&
      requestedCustodyRestrictions.reduce(
        (acc, restriction, index) =>
          `${acc}${index > 0 ? '\n' : ''}${getRestrictionByValue(restriction)}`,
        '',
      )
    : ''

  const paragraphBreak =
    hasRequestedCustodyRestrictions && hasRequestedOtherRestrictions ? '\n' : ''

  const requestedOtherRestrictionsText = hasRequestedOtherRestrictions
    ? requestedOtherRestrictions
    : ''

  return `${requestedCustodyRestrictionsText}${paragraphBreak}${requestedOtherRestrictionsText}`
}

export function formatProsecutorDemands(
  type: CaseType,
  accusedNationalId: string,
  accusedName: string,
  court: string,
  requestedValidToDate: Date | string,
  isolation: boolean,
  isExtension: boolean,
  previousDecision?: CaseDecision,
): string {
  return `Þess er krafist að ${accusedName}, kt. ${formatNationalId(
    accusedNationalId,
  )}, sæti${
    isExtension && previousDecision === CaseDecision.ACCEPTING
      ? ' áframhaldandi'
      : ''
  } ${
    type === CaseType.CUSTODY ? 'gæsluvarðhaldi' : 'farbanni'
  } með úrskurði ${court?.replace(
    'Héraðsdómur',
    'Héraðsdóms',
  )}, til ${formatDate(requestedValidToDate, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}${
    type === CaseType.CUSTODY && isolation
      ? ', og verði gert að sæta einangrun á meðan á varðhaldi stendur'
      : ''
  }.`
}

// This function is always called with case type CUSTODY or TRAVEL_BAN
export function formatConclusion(
  type: CaseType,
  accusedNationalId: string,
  accusedName?: string,
  accusedGender?: CaseGender,
  decision?: CaseDecision,
  validToDate?: Date,
  isolation?: boolean,
  isExtension?: boolean,
  previousDecision?: CaseDecision,
  isolationToDate?: Date,
): string {
  const isolationEndsBeforeValidToDate =
    validToDate && isolationToDate && validToDate > isolationToDate

  return decision === CaseDecision.REJECTING
    ? `Kröfu um að ${formatAccusedByGender(
        accusedGender,
      )}, ${accusedName}, kt. ${formatNationalId(accusedNationalId)}, sæti${
        isExtension && previousDecision === CaseDecision.ACCEPTING
          ? ' áframhaldandi'
          : ''
      } ${type === CaseType.CUSTODY ? 'gæsluvarðhaldi' : 'farbanni'} er hafnað.`
    : `${capitalize(
        formatAccusedByGender(accusedGender),
      )}, ${accusedName}, kt. ${formatNationalId(
        accusedNationalId,
      )}, skal sæta ${
        decision === CaseDecision.ACCEPTING
          ? `${
              isExtension && previousDecision === CaseDecision.ACCEPTING
                ? 'áframhaldandi '
                : ''
            }${type === CaseType.CUSTODY ? 'gæsluvarðhaldi' : 'farbanni'}`
          : // decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            `${
              isExtension &&
              previousDecision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                ? 'áframhaldandi '
                : ''
            }farbanni`
      }, þó ekki lengur en til ${formatDate(validToDate, 'PPPPp')
        ?.replace('dagur,', 'dagsins')
        ?.replace(' kl.', ', kl.')}.${
        decision === CaseDecision.ACCEPTING && isolation
          ? ` ${capitalize(
              formatAccusedByGender(accusedGender),
            )} skal sæta einangrun ${
              isolationEndsBeforeValidToDate
                ? `ekki lengur en til ${formatDate(isolationToDate, 'PPPPp')
                    ?.replace('dagur,', 'dagsins')
                    ?.replace(' kl.', ', kl.')}.`
                : 'á meðan á gæsluvarðhaldinu stendur.'
            }`
          : ''
      }`
}

export function formatGender(gender?: CaseGender): string {
  switch (gender) {
    case CaseGender.MALE:
      return 'Karl'
    case CaseGender.FEMALE:
      return 'Kona'
    case CaseGender.OTHER:
    default:
      return 'Kynsegin/Annað'
  }
}

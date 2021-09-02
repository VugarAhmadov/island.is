import type { Institution } from './institution'
import type { Notification } from './notification'
import type { CaseFile } from './file'
import type { User } from './user'

export enum CaseType {
  CUSTODY = 'CUSTODY',
  TRAVEL_BAN = 'TRAVEL_BAN',
  SEARCH_WARRANT = 'SEARCH_WARRANT',
  BANKING_SECRECY_WAIVER = 'BANKING_SECRECY_WAIVER',
  PHONE_TAPPING = 'PHONE_TAPPING',
  TELECOMMUNICATIONS = 'TELECOMMUNICATIONS',
  TRACKING_EQUIPMENT = 'TRACKING_EQUIPMENT',
  PSYCHIATRIC_EXAMINATION = 'PSYCHIATRIC_EXAMINATION',
  SOUND_RECORDING_EQUIPMENT = 'SOUND_RECORDING_EQUIPMENT',
  AUTOPSY = 'AUTOPSY',
  BODY_SEARCH = 'BODY_SEARCH',
  INTERNET_USAGE = 'INTERNET_USAGE',
  OTHER = 'OTHER',
}

export enum CaseState {
  NEW = 'NEW',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export enum CaseTransition {
  OPEN = 'OPEN',
  SUBMIT = 'SUBMIT',
  RECEIVE = 'RECEIVE',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  DELETE = 'DELETE',
}

/* eslint-disable @typescript-eslint/naming-convention */
export enum CaseCustodyProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // 2. mgr. 95. gr.
  _98_2 = '_98_2', // 2. mgr. 98. gr.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
  _100_1 = '_100_1', // 1. mgr. 100. gr. sml.
}
/* eslint-enable @typescript-eslint/naming-convention */

export enum CaseCustodyRestrictions {
  ISOLATION = 'ISOLATION',
  VISITAION = 'VISITAION',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
  ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION = 'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
  ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT = 'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT',
}

export enum CaseAppealDecision {
  APPEAL = 'APPEAL',
  ACCEPT = 'ACCEPT',
  POSTPONE = 'POSTPONE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum CaseGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum CaseDecision {
  ACCEPTING = 'ACCEPTING',
  REJECTING = 'REJECTING',
  ACCEPTING_ALTERNATIVE_TRAVEL_BAN = 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
  ACCEPTING_PARTIALLY = 'ACCEPTING_PARTIALLY',
}

export enum AccusedPleaDecision {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum SessionArrangements {
  ALL_PRESENT = 'ALL_PRESENT',
  PROSECUTOR_PRESENT = 'PROSECUTOR_PRESENT',
  REMOTE_SESSION = 'REMOTE_SESSION',
}

export interface Case {
  id: string
  created: string
  modified: string
  type: CaseType
  description?: string
  state: CaseState
  policeCaseNumber: string
  accusedNationalId: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  defenderIsSpokesperson?: boolean
  court?: Institution
  leadInvestigator?: string
  arrestDate?: string
  requestedCourtDate?: string
  requestedValidToDate?: string
  demands?: string
  lawsBroken?: string
  legalBasis?: string
  custodyProvisions?: CaseCustodyProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  requestedOtherRestrictions?: string
  caseFacts?: string
  legalArguments?: string
  requestProsecutorOnlySession?: boolean
  prosecutorOnlySessionRequest?: string
  comments?: string
  caseFilesComments?: string
  prosecutor?: User
  sharedWithProsecutorsOffice?: Institution
  courtCaseNumber?: string
  sessionArrangements?: SessionArrangements
  courtDate?: string
  courtRoom?: string
  courtStartDate?: string
  courtEndTime?: string
  courtAttendees?: string
  prosecutorDemands?: string
  courtDocuments?: string[]
  isAccusedAbsent?: boolean
  accusedPleaDecision?: AccusedPleaDecision
  accusedPleaAnnouncement?: string
  litigationPresentations?: string
  courtCaseFacts?: string
  courtLegalArguments?: string
  ruling?: string
  decision?: CaseDecision
  validToDate?: string
  isValidToDateInThePast?: boolean
  custodyRestrictions?: CaseCustodyRestrictions[]
  otherRestrictions?: string
  isolationToDate?: string
  conclusion?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  accusedPostponedAppealDate?: string
  prosecutorPostponedAppealDate?: string
  isAppealDeadlineExpired?: boolean
  isAppealGracePeriodExpired?: boolean
  rulingDate?: string
  registrar?: User
  judge?: User
  parentCase?: Case
  childCase?: Case
  notifications?: Notification[]
  files?: CaseFile[]
}

export interface CreateCase {
  type: CaseType
  description?: string
  policeCaseNumber: string
  accusedNationalId: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  courtId?: string
  leadInvestigator?: string
}

export interface UpdateCase {
  type?: string
  description?: string
  policeCaseNumber?: string
  accusedNationalId?: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  defenderIsSpokesperson?: boolean
  courtId?: string
  leadInvestigator?: string
  arrestDate?: string
  requestedCourtDate?: string
  requestedValidToDate?: string
  demands?: string
  lawsBroken?: string
  legalBasis?: string
  custodyProvisions?: CaseCustodyProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  requestedOtherRestrictions?: string
  caseFacts?: string
  legalArguments?: string
  requestProsecutorOnlySession?: boolean
  prosecutorOnlySessionRequest?: string
  comments?: string
  caseFilesComments?: string
  prosecutorId?: string
  sharedWithProsecutorsOfficeId?: string
  courtCaseNumber?: string
  sessionArrangements?: SessionArrangements
  courtDate?: string
  courtRoom?: string
  courtStartDate?: string
  courtEndTime?: string
  courtAttendees?: string
  prosecutorDemands?: string
  courtDocuments?: string[]
  isAccusedAbsent?: boolean
  accusedPleaDecision?: AccusedPleaDecision
  accusedPleaAnnouncement?: string
  litigationPresentations?: string
  courtCaseFacts?: string
  courtLegalArguments?: string
  ruling?: string
  decision?: CaseDecision
  validToDate?: string
  custodyRestrictions?: CaseCustodyRestrictions[]
  otherRestrictions?: string
  isolationToDate?: string
  conclusion?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  accusedPostponedAppealDate?: string | null
  prosecutorPostponedAppealDate?: string
  registrarId?: string
  judgeId?: string
}

export interface TransitionCase {
  modified: string
  transition: CaseTransition
}

export interface RequestSignatureResponse {
  controlCode: string
  documentToken: string
}

export interface SignatureConfirmationResponse {
  documentSigned: boolean
  code?: number
  message?: string
}

export interface CreateCourtCase {
  type: CaseType
  policeCaseNumber: string
  isExtension: boolean
}

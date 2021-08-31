import {
  capitalize,
  formatAccusedByGender,
  formatDate,
  formatNationalId,
  formatCustodyRestrictions,
  laws,
  formatGender,
  caseTypes,
  formatConclusion,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system/types'

function custodyProvisionsOrder(p: CaseCustodyProvisions) {
  switch (p) {
    case CaseCustodyProvisions._95_1_A:
      return 0
    case CaseCustodyProvisions._95_1_B:
      return 1
    case CaseCustodyProvisions._95_1_C:
      return 2
    case CaseCustodyProvisions._95_1_D:
      return 3
    case CaseCustodyProvisions._95_2:
      return 4
    case CaseCustodyProvisions._98_2:
      return 5
    case CaseCustodyProvisions._99_1_B:
      return 6
    case CaseCustodyProvisions._100_1:
      return 7
    default:
      return 999
  }
}

function custodyProvisionsCompare(
  p1: CaseCustodyProvisions,
  p2: CaseCustodyProvisions,
) {
  const o1 = custodyProvisionsOrder(p1)
  const o2 = custodyProvisionsOrder(p2)

  return o1 < o2 ? -1 : o1 > o2 ? 1 : 0
}

export function formatCustodyProvisions(
  custodyProvisions?: CaseCustodyProvisions[],
): string {
  return (
    custodyProvisions
      ?.sort((p1, p2) => custodyProvisionsCompare(p1, p2))
      .reduce((s, l) => `${s}${laws[l]}\n`, '')
      .slice(0, -1) ?? 'Lagaákvæði ekki skráð'
  )
}

export function formatAppeal(
  appealDecision: CaseAppealDecision | undefined,
  stakeholder: string,
  includeBullet = true,
): string {
  switch (appealDecision) {
    case CaseAppealDecision.APPEAL:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} kærir úrskurðinn.`
    case CaseAppealDecision.ACCEPT:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} unir úrskurðinum.`
    case CaseAppealDecision.POSTPONE:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} tekur sér lögboðinn frest.`
    default:
      return ''
  }
}

export function formatCourtHeadsUpSmsNotification(
  type: CaseType,
  prosecutorName?: string,
  arrestDate?: Date,
  requestedCourtDate?: Date,
): string {
  // Prosecutor
  const prosecutorText = ` Ákærandi: ${prosecutorName ?? 'Ekki skráður'}.`

  // Arrest date
  const arrestDateText = arrestDate
    ? ` Viðkomandi handtekinn ${formatDate(arrestDate, 'Pp')?.replace(
        ' ',
        ', kl. ',
      )}.`
    : ''

  // Court date
  const requestedCourtDateText = requestedCourtDate
    ? ` ÓE fyrirtöku ${formatDate(requestedCourtDate, 'Pp')?.replace(
        ' ',
        ', eftir kl. ',
      )}.`
    : ''

  const newCaseText = `Ný ${
    type === CaseType.CUSTODY
      ? 'gæsluvarðhaldskrafa'
      : type === CaseType.TRAVEL_BAN
      ? 'farbannskrafa'
      : type === CaseType.OTHER
      ? 'krafa um rannsóknarheimild'
      : `krafa um rannsóknarheimild (${caseTypes[type]})`
  } í vinnslu.`

  return `${newCaseText}${prosecutorText}${arrestDateText}${requestedCourtDateText}`
}

export function formatCourtReadyForCourtSmsNotification(
  type: CaseType,
  prosecutorName?: string,
  court?: string,
) {
  const submittedCaseText =
    type === CaseType.CUSTODY
      ? 'Gæsluvarðhaldskrafa'
      : type === CaseType.TRAVEL_BAN
      ? 'Farbannskrafa'
      : type === CaseType.OTHER
      ? 'Krafa um rannsóknarheimild'
      : `Krafa um rannsóknarheimild (${caseTypes[type]})`
  const prosecutorText = ` Ákærandi: ${prosecutorName ?? 'Ekki skráður'}.`
  const courtText = ` Dómstóll: ${court ?? 'Ekki skráður'}.`

  return `${submittedCaseText} tilbúin til afgreiðslu.${prosecutorText}${courtText}`
}

export function formatProsecutorReceivedByCourtSmsNotification(
  type: CaseType,
  court?: string,
  courtCaseNumber?: string,
): string {
  const receivedCaseText =
    type === CaseType.CUSTODY || type === CaseType.TRAVEL_BAN
      ? `${caseTypes[type]}`
      : type === CaseType.OTHER
      ? 'rannsóknarheimild'
      : `rannsóknarheimild (${caseTypes[type]})`

  return `${court} hefur móttekið kröfu um ${receivedCaseText} sem þú sendir og úthlutað málsnúmerinu ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is.`
}

export function formatProsecutorCourtDateEmailNotification(
  type: CaseType,
  court?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  defenderName?: string,
  defenderIsSpokesperson?: boolean,
  sessionArrangements = SessionArrangements.ALL_PRESENT, // Defaults to ALL_PRESENT when not specified
): string {
  const scheduledCaseText =
    type === CaseType.CUSTODY
      ? 'gæsluvarðhaldskröfu'
      : type === CaseType.TRAVEL_BAN
      ? 'farbannskröfu'
      : type === CaseType.OTHER
      ? 'kröfu um rannsóknarheimild'
      : `kröfu um rannsóknarheimild (${caseTypes[type]})`
  const courtDateText = formatDate(courtDate, 'PPPp')?.replace(' kl.', ', kl.')
  const courtRoomText =
    sessionArrangements === SessionArrangements.REMOTE_SESSION
      ? 'Úrskurðað verður um kröfuna án mætingar af hálfu málsaðila'
      : `Dómsalur: ${courtRoom}`
  const judgeText = judgeName
    ? `Dómari: ${judgeName}`
    : 'Dómari hefur ekki verið skráður'
  const registrarText = registrarName
    ? `Dómritari: ${registrarName}`
    : 'Dómritari hefur ekki verið skráður'
  const defenderText = defenderName
    ? `${
        defenderIsSpokesperson ? 'Talsmaður' : 'Verjandi'
      } sakbornings: ${defenderName}`
    : `${
        defenderIsSpokesperson ? 'Talsmaður' : 'Verjandi'
      } sakbornings hefur ekki verið skráður`

  return `${court} hefur staðfest fyrirtökutíma fyrir ${scheduledCaseText}.<br /><br />Fyrirtaka mun fara fram ${courtDateText}.<br /><br />${courtRoomText}.<br /><br />${judgeText}.<br /><br />${registrarText}.<br /><br />${defenderText}.`
}

export function formatPrisonCourtDateEmailNotification(
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  accusedName?: string,
  accusedGender?: CaseGender,
  requestedValidToDate?: Date,
  isolation?: boolean,
  defenderName?: string,
  defenderIsSpokesperson?: boolean,
  isExtension?: boolean,
): string {
  const courtText = court?.replace('dómur', 'dóms')
  const courtDateText = formatDate(courtDate, 'PPPPp')
    ?.replace('dagur,', 'daginn')
    ?.replace(' kl.', ', kl.')
  const requestedValidToDateText = formatDate(requestedValidToDate, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')
  const requestText = `Nafn sakbornings: ${accusedName}.<br /><br />Kyn sakbornings: ${formatGender(
    accusedGender,
  )}.<br /><br />Krafist er gæsluvarðhalds til ${requestedValidToDateText}.`
  const isolationText = isolation
    ? 'Farið er fram á einangrun.'
    : 'Ekki er farið fram á einangrun.'
  const defenderText = defenderName
    ? `${
        defenderIsSpokesperson ? 'Talsmaður' : 'Verjandi'
      } sakbornings: ${defenderName}`
    : `${
        defenderIsSpokesperson ? 'Talsmaður' : 'Verjandi'
      } sakbornings hefur ekki verið skráður`

  return `${prosecutorOffice} hefur sent kröfu um ${
    isExtension ? 'áframhaldandi ' : ''
  }gæsluvarðhald til ${courtText} og verður málið tekið fyrir ${courtDateText}.<br /><br />${requestText}<br /><br />${isolationText}<br /><br />${defenderText}.`
}

export function formatDefenderCourtDateEmailNotification(
  court?: string,
  courtCaseNumber?: string,
  courtDate?: Date,
  courtRoom?: string,
  defenderIsSpokesperson = false,
): string {
  return `${court} hefur boðað þig í fyrirtöku sem ${
    defenderIsSpokesperson ? 'talsmann' : 'verjanda'
  } sakbornings.<br /><br />Fyrirtaka mun fara fram ${formatDate(
    courtDate,
    'PPPPp',
  )
    ?.replace('dagur,', 'daginn')
    ?.replace(
      ' kl.',
      ', kl.',
    )}.<br /><br />Málsnúmer: ${courtCaseNumber}.<br /><br />Dómsalur: ${courtRoom}.`
}

export function formatCourtDateNotificationCondition(
  courtDate?: Date,
  defenderEmail?: string,
): string {
  return `courtDate=${formatDate(
    courtDate,
    'Pp',
  )},defenderEmail=${defenderEmail}`
}

// This function is only intended for case type CUSTODY
export function formatPrisonRulingEmailNotification(
  accusedNationalId: string,
  accusedName?: string,
  accusedGender?: CaseGender,
  court?: string,
  prosecutorName?: string,
  courtEndTime?: Date,
  defenderName?: string,
  defenderEmail?: string,
  defenderIsSpokesperson?: boolean,
  decision?: CaseDecision,
  validToDate?: Date,
  custodyRestrictions?: CaseCustodyRestrictions[],
  accusedAppealDecision?: CaseAppealDecision,
  prosecutorAppealDecision?: CaseAppealDecision,
  judgeName?: string,
  judgeTitle?: string,
  isExtension?: boolean,
  previousDecision?: CaseDecision,
  conclusion?: string,
  isolationToDate?: Date,
): string {
  return `<strong>Úrskurður um gæsluvarðhald</strong><br /><br />${court}, ${formatDate(
    courtEndTime,
    'PPP',
  )}.<br /><br />Þinghaldi lauk kl. ${formatDate(
    courtEndTime,
    'p',
  )}.<br /><br />Ákærandi: ${prosecutorName}.<br />${
    defenderIsSpokesperson ? 'Talsmaður' : 'Verjandi'
  }: ${
    defenderName
      ? defenderEmail
        ? `${defenderName}, ${defenderEmail}`
        : defenderName
      : defenderEmail
      ? defenderEmail
      : 'Hefur ekki verið skráður'
  }.<br /><br /><strong>Úrskurðarorð</strong><br /><br />${formatConclusion(
    CaseType.CUSTODY,
    accusedNationalId,
    accusedName,
    accusedGender,
    decision,
    validToDate,
    custodyRestrictions?.includes(CaseCustodyRestrictions.ISOLATION),
    isExtension,
    previousDecision,
    isolationToDate,
  )}${
    conclusion ? `<br /><br />${conclusion}` : ''
  }<br /><br /><strong>Ákvörðun um kæru</strong><br />${formatAppeal(
    accusedAppealDecision,
    capitalize(formatAccusedByGender(accusedGender)),
    false,
  )}<br />${formatAppeal(prosecutorAppealDecision, 'Sækjandi', false)}${
    decision === CaseDecision.ACCEPTING
      ? `<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />${formatCustodyRestrictions(
          accusedGender,
          custodyRestrictions,
          validToDate,
          isolationToDate,
        )}`
      : ''
  }<br /><br />${judgeName} ${judgeTitle}`
}

export function formatCourtRevokedSmsNotification(
  type: CaseType,
  prosecutorName?: string,
  requestedCourtDate?: Date,
  courtDate?: Date,
) {
  // Prosecutor
  const prosecutorText = ` Ákærandi: ${prosecutorName ?? 'Ekki skráður'}.`

  // Court date
  const courtDateText = courtDate
    ? ` Fyrirtökutími: ${formatDate(courtDate, 'Pp')?.replace(' ', ', kl. ')}.`
    : requestedCourtDate
    ? ` ÓVE fyrirtöku ${formatDate(requestedCourtDate, 'Pp')?.replace(
        ' ',
        ', eftir kl. ',
      )}.`
    : ''

  return `${
    type === CaseType.CUSTODY ? 'Gæsluvarðhaldskrafa' : 'Farbannskrafa'
  } afturkölluð.${prosecutorText}${courtDateText}`
}

export function formatPrisonRevokedEmailNotification(
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  accusedName?: string,
  defenderName?: string,
  isExtension?: boolean,
): string {
  const courtText = court?.replace('dómur', 'dóms')
  const courtDateText = formatDate(courtDate, 'PPPPp')
    ?.replace('dagur,', 'daginn')
    ?.replace(' kl.', ', kl.')
  const accusedNameText = `Nafn sakbornings: ${accusedName}.`
  const defenderText = defenderName
    ? `Verjandi sakbornings: ${defenderName}`
    : 'Verjandi sakbornings hefur ekki verið skráður'

  return `${prosecutorOffice} hefur afturkallað kröfu um ${
    isExtension ? 'áframhaldandi ' : ''
  }gæsluvarðhald sem send var til ${courtText} og taka átti fyrir ${courtDateText}.<br /><br />${accusedNameText}<br /><br />${defenderText}.`
}

export function formatDefenderRevokedEmailNotification(
  type: CaseType,
  accusedNationalId: string,
  accusedName?: string,
  court?: string,
  courtDate?: Date,
): string {
  const courtText = court?.replace('dómur', 'dómi')
  const courtDateText = formatDate(courtDate, 'PPPPp')
    ?.replace('dagur,', 'daginn')
    ?.replace(' kl.', ', kl.')

  return `${
    type === CaseType.CUSTODY ? 'Gæsluvarðhaldskrafa' : 'Farbannskrafa'
  } sem taka átti fyrir hjá ${courtText} ${courtDateText}, hefur verið afturkölluð.<br /><br />Sakborningur: ${accusedName}, kt. ${formatNationalId(
    accusedNationalId,
  )}.<br /><br />Dómstóllinn hafði skráð þig sem verjanda sakbornings.`
}

export function stripHtmlTags(html: string): string {
  return html.replace(/(?:<br \/>)/g, '\n').replace(/(?:<\/?strong>)/g, '')
}

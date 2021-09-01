import {
  DraftingStatus,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraft,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import {
  HTMLText,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
} from '@island.is/regulations'
import { Kennitala, RegulationType } from '@island.is/regulations'
import { Step } from '../types'

export type DraftIdFromParam = 'new' | RegulationDraftId

export type StepNav = {
  prev?: Step
  next?: Step
}

export type DraftFieldExtras = {
  min: Date
  max: Date
}

export type DraftField<Type, Extras extends keyof DraftFieldExtras = never> = {
  value: Type
  dirty?: boolean
  guessed?: boolean
  error?: string
} & Pick<DraftFieldExtras, Extras>

// TODO: Figure out how the Editor components lazy valueRef.current() getter fits into this
export type HtmlDraftField = DraftField<HTMLText>

export type BodyDraftFields = {
  title: DraftField<PlainText>
  text: HtmlDraftField
  appendixes: ReadonlyArray<{
    title: DraftField<PlainText>
    text: HtmlDraftField
  }>
  comments: HtmlDraftField
}

export type ChangeDraftFields = Readonly<
  // always prefilled on "create" - non-editable
  Pick<DraftRegulationChange, 'id' | 'type' | 'name'>
> & { date: DraftField<Date> } & BodyDraftFields

export type CancelDraftFields = Readonly<
  // always prefilled on "create" - non-editable
  Pick<DraftRegulationCancel, 'id' | 'type' | 'name'>
> & { date: DraftField<Date> }

export type RegDraftForm = BodyDraftFields & {
  idealPublishDate: DraftField<Date | undefined>
  signatureDate: DraftField<Date | undefined>
  effectiveDate: DraftField<Date | undefined>
  lawChapters: DraftField<ReadonlyArray<LawChapterSlug> | undefined>
  ministry: DraftField<MinistrySlug | undefined>
  type: DraftField<RegulationType | undefined>

  impacts: ReadonlyArray<ChangeDraftFields | CancelDraftFields>

  readonly draftingStatus: DraftingStatus // non-editable except via saveStatus or propose actions
  draftingNotes: HtmlDraftField
  authors: DraftField<ReadonlyArray<Kennitala>>

  id: RegulationDraft['id']
  fastTrack: RegulationDraft['fastTrack']
}

export type DraftingState = {
  isEditor: boolean
  stepName: Step
  savingStatus?: boolean
  loading?: boolean
  error?: Error
  draft?: RegDraftForm
}

// -----------------------------

export type NameValuePair<O extends Record<string, any>> = {
  [Key in keyof O]: {
    name: Key
    value: O[Key]
  }
}[keyof O]

export type RegDraftFormSimpleProps =
  | 'title'
  | 'text'
  | 'idealPublishDate' // This prop needs its own action that checks for working days and updates the `fastTrack` flag accordingly
  | 'signatureDate' // Need to be checked and must never be **after* `idealPublishDate`
  | 'effectiveDate' // Need to be checked and must never be **before** `idealPublishDate`
  // | 'lawChapters'
  | 'ministry'
  | 'type'
  | 'draftingNotes'
  | 'authors'

export type Action =
  | { type: 'CHANGE_STEP'; stepName: Step }
  | { type: 'LOADING_DRAFT' }
  | { type: 'LOADING_DRAFT_SUCCESS'; draft: RegulationDraft }
  | { type: 'LOADING_DRAFT_ERROR'; error: Error }
  | { type: 'SAVING_STATUS' }
  | { type: 'SAVING_STATUS_DONE'; error?: Error }
  | {
      type: 'UPDATE_LAWCHAPTER_PROP'
      action?: 'add' | 'delete'
      value: LawChapterSlug | undefined
    }
  | {
      type: 'UPDATE_MULTIPLE_PROPS'
      multiData: Partial<RegDraftForm>
    }
  | ({ type: 'UPDATE_PROP' } & NameValuePair<
      Pick<RegDraftForm, RegDraftFormSimpleProps>
    >)
  | { type: 'SHIP' }

export type ActionName = Action['type']

export type UpdateAction = Extract<Action, { type: 'UPDATE_PROP' }>

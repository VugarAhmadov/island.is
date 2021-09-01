import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { RegulationDraftId } from '@island.is/regulations/admin'
import { isUuid } from 'uuidv4'
import { EditBasics } from '../components/EditBasics'
import { EditMeta } from '../components/EditMeta'
import { editorMsgs } from '../messages'
import { Step } from '../types'
import { ButtonBar } from '../components/ButtonBar'
import {
  useDraftingState,
  steps,
  StepComponent,
} from '../state/useDraftingState'
import { DraftIdFromParam } from '../state/types'
import { MessageDescriptor } from 'react-intl'
// import { gql, useQuery } from '@apollo/client'
// import { Query } from '@island.is/api/schema'

// const RegulationDraftQuery = gql`
//   query regulationDraft {
//     regulationDraft {
//       id
//       school
//       programme
//       date
//     }
//   }
// `

const stepData: Record<
  Step,
  {
    title: MessageDescriptor
    intro?: MessageDescriptor
    Component: StepComponent
  }
> = {
  basics: {
    title: editorMsgs.step1Headline,
    Component: EditBasics,
  },
  meta: {
    title: editorMsgs.step2Headline,
    Component: EditMeta,
  },
  impacts: {
    title: editorMsgs.step3Headline,
    Component: () => <p>Skref 3</p>,
  },
  review: {
    title: editorMsgs.step4Headline,
    Component: () => <p>Skref 4</p>,
  },
}

// ---------------------------------------------------------------------------

const assertStep = (maybeStep?: string): Step => {
  if (!maybeStep) {
    return 'basics'
  }
  if (maybeStep in steps) {
    return maybeStep as Step
  }
  throw new Error('Invalid RegulationDraft editing Step')
}
const assertDraftId = (maybeId: string): DraftIdFromParam => {
  if (maybeId === 'new') {
    return maybeId
  }

  if (isUuid(maybeId)) {
    return maybeId as RegulationDraftId
  }
  throw new Error('Invalid RegulationDraft editing Id')
}

// ---------------------------------------------------------------------------

const Edit = () => {
  useNamespaces('ap.regulations-admin')
  const t = useLocale().formatMessage
  const params = useParams<{ id: string; step?: string }>()
  const id = assertDraftId(params.id)
  const stepName = assertStep(params.step)

  const { state, stepNav, actions } = useDraftingState(id, stepName)
  const { loading, error, savingStatus, draft } = state

  const step = stepData[stepName]

  if (!loading && !draft) {
    throw new Error(`Regulation ${id} not found`)
  }

  return (
    <Fragment key={id}>
      <Box marginBottom={[2, 2, 4]}>
        <Text as="h1" variant="h1">
          {t(step.title)}
        </Text>
        {step.intro && (
          <Text as="p" marginTop={1}>
            {t(step.intro)}
          </Text>
        )}
      </Box>

      {draft ? (
        <step.Component actions={actions} new={id === 'new'} draft={draft} />
      ) : (
        <SkeletonLoader height={120} />
      )}

      <ButtonBar id={id} stepNav={stepNav} actions={actions} />
    </Fragment>
  )
}

export default Edit

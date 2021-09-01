import React, { useEffect, useState } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { Case, CaseDecision } from '@island.is/judicial-system/types'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useRouter } from 'next/router'
import RulingStepTwoForm from './RulingStepTwoForm'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

const RulingStepTwo = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const router = useRouter()
  const id = router.query.id
  const { autofill } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      if (data.case.decision === CaseDecision.ACCEPTING && data.case.demands) {
        autofill('conclusion', data.case.demands, data.case)
      }
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data, autofill])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase && (
        <RulingStepTwoForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          isLoading={loading}
        />
      )}
    </PageLayout>
  )
}

export default RulingStepTwo

import React from 'react'
import { useIntl } from 'react-intl'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  Input,
  Tooltip,
} from '@island.is/island-ui/core'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  useCase,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { rcCaseFiles as m } from '@island.is/judicial-system-web/messages'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import MarkdownWrapper from '@island.is/judicial-system-web/src/shared-components/MarkdownWrapper/MarkdownWrapper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

export const StepFiveForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useS3Upload(workingCase)
  const { updateCase } = useCase()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.description.heading)}
            </Text>
          </Box>
          <MarkdownWrapper
            text={m.sections.description.list}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.files.heading)}
          </Text>
        </Box>
        <Box marginBottom={10}>
          <ContentBlock>
            <InputFileUpload
              fileList={files}
              header={formatMessage(m.sections.files.label)}
              buttonLabel={formatMessage(m.sections.files.buttonLabel)}
              onChange={onChange}
              onRemove={onRemove}
              onRetry={onRetry}
              errorMessage={uploadErrorMessage}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              {formatMessage(m.sections.comments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(m.sections.comments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(m.sections.comments.label)}
              placeholder={formatMessage(m.sections.comments.placeholder)}
              defaultValue={workingCase?.caseFilesComments}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(
                  workingCase.id,
                  parseString('caseFilesComments', evt.target.value),
                )
              }
              textarea
              rows={7}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
          nextUrl={`${
            workingCase.type === CaseType.CUSTODY ||
            workingCase.type === CaseType.TRAVEL_BAN
              ? Constants.STEP_SIX_ROUTE
              : Constants.IC_POLICE_CONFIRMATION_ROUTE
          }/${workingCase.id}`}
          nextIsDisabled={false}
        />
      </FormContentContainer>
    </>
  )
}

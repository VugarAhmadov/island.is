import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import {
  Case,
  CaseCustodyProvisions,
  CaseType,
} from '@island.is/judicial-system/types'
import {
  CaseFileList,
  FormContentContainer,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/shared-components'
import { Box, Button, Text } from '@island.is/island-ui/core'
import * as styles from './Overview.treat'
import {
  capitalize,
  formatDate,
  formatRequestedCustodyRestrictions,
  laws,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { requestCourtDate } from '@island.is/judicial-system-web/messages'
import CourtCaseNumber from '../../SharedComponents/CourtCaseNumber/CourtCaseNumber'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  handleCreateCourtCase: (wc: Case) => void
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
  setIsDraftingConclusion: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >
  isCreatingCourtCase: boolean
  receiveCase: (wc: Case, courtCaseNumber: string) => void
}

const OverviewForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    handleCreateCourtCase,
    createCourtCaseSuccess,
    setCreateCourtCaseSuccess,
    courtCaseNumberEM,
    setCourtCaseNumberEM,
    setIsDraftingConclusion,
    isCreatingCourtCase,
    receiveCase,
  } = props
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          {`Yfirlit ${
            workingCase.type === CaseType.CUSTODY
              ? 'gæsluvarðhaldskröfu'
              : 'farbannskröfu'
          }`}
        </Text>
      </Box>
      <Box component="section" marginBottom={6}>
        <CourtCaseNumber
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          courtCaseNumberEM={courtCaseNumberEM}
          setCourtCaseNumberEM={setCourtCaseNumberEM}
          createCourtCaseSuccess={createCourtCaseSuccess}
          setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
          handleCreateCourtCase={handleCreateCourtCase}
          isCreatingCourtCase={isCreatingCourtCase}
          receiveCase={receiveCase}
        />
      </Box>
      <Box component="section" marginBottom={5}>
        <InfoCard
          data={[
            {
              title: 'Embætti',
              value: `${
                workingCase.prosecutor?.institution?.name ?? 'Ekki skráð'
              }`,
            },
            {
              title: formatMessage(requestCourtDate.heading),
              value: `${capitalize(
                formatDate(workingCase.requestedCourtDate, 'PPPP', true) ?? '',
              )} eftir kl. ${formatDate(
                workingCase.requestedCourtDate,
                TIME_FORMAT,
              )}`,
            },
            { title: 'Ákærandi', value: workingCase.prosecutor?.name },
            {
              title: workingCase.parentCase
                ? `${
                    workingCase.type === CaseType.CUSTODY
                      ? 'Fyrri gæsla'
                      : 'Fyrra farbann'
                  }`
                : 'Tími handtöku',
              value: workingCase.parentCase
                ? `${capitalize(
                    formatDate(
                      workingCase.parentCase.validToDate,
                      'PPPP',
                      true,
                    ) ?? '',
                  )} kl. ${formatDate(
                    workingCase.parentCase.validToDate,
                    TIME_FORMAT,
                  )}`
                : workingCase.arrestDate
                ? `${capitalize(
                    formatDate(workingCase.arrestDate, 'PPPP', true) ?? '',
                  )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`
                : 'Var ekki skráður',
            },
          ]}
          accusedName={workingCase.accusedName}
          accusedNationalId={workingCase.accusedNationalId}
          accusedAddress={workingCase.accusedAddress}
          defender={{
            name: workingCase.defenderName ?? '',
            email: workingCase.defenderEmail,
            phoneNumber: workingCase.defenderPhoneNumber,
          }}
        />
      </Box>
      <Box marginBottom={5}>
        <Box marginBottom={9}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h2">
              Dómkröfur
            </Text>
          </Box>
          <Text>{workingCase.demands}</Text>
        </Box>
        <div className={styles.infoSection}>
          <Box marginBottom={6} data-testid="lawsBroken">
            <Box marginBottom={1}>
              <Text as="h2" variant="h3">
                Lagaákvæði sem brot varða við
              </Text>
            </Box>
            <Text>
              <span className={styles.breakSpaces}>
                {workingCase.lawsBroken}
              </span>
            </Text>
          </Box>
          <Box data-testid="custodyProvisions">
            <Box marginBottom={1}>
              <Text as="h2" variant="h3">
                Lagaákvæði sem krafan er byggð á
              </Text>
            </Box>
            {workingCase.custodyProvisions?.map(
              (custodyProvision: CaseCustodyProvisions, index) => {
                return (
                  <div key={index}>
                    <Text>{laws[custodyProvision]}</Text>
                  </div>
                )
              },
            )}
          </Box>
        </div>
        <div className={styles.infoSection} data-testid="custodyRestrictions">
          <Box marginBottom={1}>
            <Text variant="h3" as="h2">
              {`Takmarkanir og tilhögun ${
                workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
              }`}
            </Text>
          </Box>
          {formatRequestedCustodyRestrictions(
            workingCase.type,
            workingCase.requestedCustodyRestrictions,
            workingCase.requestedOtherRestrictions,
          )
            .split('\n')
            .map((requestedCustodyRestriction, index) => {
              return (
                <div key={index}>
                  <Text>{requestedCustodyRestriction}</Text>
                </div>
              )
            })}
        </div>
        {(workingCase.caseFacts || workingCase.legalArguments) && (
          <div className={styles.infoSection}>
            <Box marginBottom={1}>
              <Text variant="h3" as="h2">
                Greinargerð um málsatvik og lagarök
              </Text>
            </Box>
            {workingCase.caseFacts && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="eyebrow" color="blue400">
                    Málsatvik
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.caseFacts}
                  </span>
                </Text>
              </Box>
            )}
            {workingCase.legalArguments && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="eyebrow" color="blue400">
                    Lagarök
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.legalArguments}
                  </span>
                </Text>
              </Box>
            )}
          </div>
        )}
        {(workingCase.comments || workingCase.caseFilesComments) && (
          <div className={styles.infoSection}>
            <Box marginBottom={2}>
              <Text variant="h3" as="h2">
                Athugasemdir
              </Text>
            </Box>
            {workingCase.comments && (
              <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
                <Box marginBottom={1}>
                  <Text variant="h4" as="h3" color="blue400">
                    Athugasemdir vegna málsmeðferðar
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.comments}
                  </span>
                </Text>
              </Box>
            )}
            {workingCase.caseFilesComments && (
              <>
                <Box marginBottom={1}>
                  <Text variant="h4" as="h3" color="blue400">
                    Athugasemdir vegna rannsóknargagna
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.caseFilesComments}
                  </span>
                </Text>
              </>
            )}
          </div>
        )}

        <div className={styles.infoSection}>
          <Box marginBottom={1}>
            <Text as="h2" variant="h3">
              {`Rannsóknargögn (${
                workingCase.files ? workingCase.files.length : 0
              })`}
            </Text>
          </Box>
          <CaseFileList
            caseId={workingCase.id}
            files={workingCase.files ?? []}
            canOpenFiles={
              workingCase.judge !== null && workingCase.judge?.id === user?.id
            }
          />
        </div>
        <Box marginBottom={3}>
          <PdfButton
            caseId={workingCase.id}
            title="Opna PDF kröfu"
            pdfType="request"
          />
        </Box>
        <Button
          variant="ghost"
          icon="pencil"
          size="small"
          onClick={() => setIsDraftingConclusion(true)}
        >
          Skrifa drög að niðurstöðu
        </Button>
      </Box>
    </FormContentContainer>
  )
}

export default OverviewForm

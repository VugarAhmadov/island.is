import React, { useState } from 'react'
import { ValueType } from 'react-select'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Select,
  Text,
  Tooltip,
  Option,
  Input,
  RadioButton,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseNumbers,
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseState,
  SessionArrangements,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  ReactSelectOption,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import { icHearingArrangements } from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import * as styles from './HearingArrangements.treat'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
  users: UserData
}

const HearingArrangementsForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading, users } = props
  const [courtroomEM, setCourtroomEM] = useState('')
  const [defenderEmailEM, setDefenderEmailEM] = useState('')
  const [defenderPhoneNumberEM, setDefenderPhoneNumberEM] = useState('')
  const [courtDateIsValid, setCourtDateIsValid] = useState(true)
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  const validations: FormSettings = {
    judge: {
      validations: ['empty'],
    },
    registrar: {
      validations: ['empty'],
    },
    courtRoom: {
      validations: ['empty'],
    },
  }

  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  const setJudge = (id: string) => {
    if (workingCase) {
      setAndSendToServer('judgeId', id, workingCase, setWorkingCase, updateCase)

      const judge = users?.users.find((j) => j.id === id)

      setWorkingCase({ ...workingCase, judge: judge })
    }
  }

  const setRegistrar = (id: string) => {
    if (workingCase) {
      setAndSendToServer(
        'registrarId',
        id,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      const registrar = users?.users.find((r) => r.id === id)

      setWorkingCase({ ...workingCase, registrar: registrar })
    }
  }

  const judges = (users?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id }
    })

  const registrars = (users?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.REGISTRAR &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )
  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Fyrirtaka
          </Text>
        </Box>
        {workingCase.state === CaseState.DRAFT && (
          <Box marginBottom={8}>
            <AlertMessage
              type="info"
              title="Krafa hefur ekki verið staðfest af ákæranda"
              message="Þú getur úthlutað fyrirtökutíma, dómsal og verjanda en ekki er hægt að halda áfram fyrr en ákærandi hefur staðfest kröfuna."
            />
          </Box>
        )}
        <Box component="section" marginBottom={7}>
          <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Dómari{' '}
              <Tooltip
                text={formatMessage(
                  icHearingArrangements.sections.setJudge.tooltip,
                )}
              />
            </Text>
          </Box>
          <Select
            name="judge"
            label="Veldu dómara"
            placeholder="Velja héraðsdómara"
            defaultValue={defaultJudge}
            options={judges}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setJudge((selectedOption as ReactSelectOption).value.toString())
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Dómritari{' '}
              <Tooltip
                text={formatMessage(
                  icHearingArrangements.sections.setRegistrar.tooltip,
                )}
              />
            </Text>
          </Box>
          <Select
            name="registrar"
            label="Veldu dómritara"
            placeholder="Velja dómritara"
            defaultValue={defaultRegistrar}
            options={registrars}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setRegistrar(
                (selectedOption as ReactSelectOption).value.toString(),
              )
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {`${formatMessage(
                icHearingArrangements.sections.sessionArrangements.heading,
              )} `}
              <Tooltip
                text={formatMessage(
                  icHearingArrangements.sections.sessionArrangements.tooltip,
                )}
              />
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={2}>
              <RadioButton
                name="session-arrangements-all-present"
                id="session-arrangements-all-present"
                label={formatMessage(
                  icHearingArrangements.sections.sessionArrangements.options
                    .allPresent,
                )}
                checked={
                  workingCase.sessionArrangements ===
                  SessionArrangements.ALL_PRESENT
                }
                onChange={() => {
                  setAndSendToServer(
                    'sessionArrangements',
                    SessionArrangements.ALL_PRESENT,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="session-arrangements-prosecutor-present"
                id="session-arrangements-prosecutor-present"
                label={formatMessage(
                  icHearingArrangements.sections.sessionArrangements.options
                    .prosecutorPresent,
                )}
                checked={
                  workingCase.sessionArrangements ===
                  SessionArrangements.PROSECUTOR_PRESENT
                }
                onChange={() => {
                  setAndSendToServer(
                    'sessionArrangements',
                    SessionArrangements.PROSECUTOR_PRESENT,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </Box>
            <RadioButton
              name="session-arrangements-remote-session"
              id="session-arrangements-remote-session"
              label={formatMessage(
                icHearingArrangements.sections.sessionArrangements.options
                  .remoteSession,
              )}
              checked={
                workingCase.sessionArrangements ===
                SessionArrangements.REMOTE_SESSION
              }
              onChange={() => {
                setAndSendToServer(
                  'sessionArrangements',
                  SessionArrangements.REMOTE_SESSION,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }}
              large
              backgroundColor="white"
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Skrá fyrirtökutíma
            </Text>
          </Box>
          <Box marginBottom={2}>
            <BlueBox>
              <Box marginBottom={2}>
                <DateTime
                  name="courtDate"
                  selectedDate={
                    workingCase.courtDate
                      ? new Date(workingCase.courtDate)
                      : undefined
                  }
                  minDate={new Date()}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    newSetAndSendDateToServer(
                      'courtDate',
                      date,
                      valid,
                      workingCase,
                      setWorkingCase,
                      setCourtDateIsValid,
                      updateCase,
                    )
                  }}
                  blueBox={false}
                  required
                />
              </Box>
              <Input
                data-testid="courtroom"
                name="courtroom"
                label="Dómsalur"
                defaultValue={workingCase.courtRoom}
                placeholder="Skráðu inn dómsal"
                autoComplete="off"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'courtRoom',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    courtroomEM,
                    setCourtroomEM,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'courtRoom',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setCourtroomEM,
                  )
                }
                errorMessage={courtroomEM}
                hasError={courtroomEM !== ''}
                required
              />
            </BlueBox>
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Skipaður verjandi/talsmaður
            </Text>
          </Box>
          <BlueBox>
            <div className={styles.defenderOptions}>
              <RadioButton
                name="defender-type-defender"
                id="defender-type-defender"
                label="Verjandi"
                checked={workingCase.defenderIsSpokesperson === false}
                onChange={() => {
                  setAndSendToServer(
                    'defenderIsSpokesperson',
                    false,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                large
                backgroundColor="white"
              />
              <RadioButton
                name="defender-type-spokesperson"
                id="defender-type-spokesperson"
                label="Talsmaður"
                checked={workingCase.defenderIsSpokesperson === true}
                onChange={() => {
                  setAndSendToServer(
                    'defenderIsSpokesperson',
                    true,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </div>
            <Box marginBottom={2}>
              <Input
                name="defenderName"
                label={`Nafn ${
                  workingCase.defenderIsSpokesperson ? 'talsmanns' : 'verjanda'
                }`}
                defaultValue={workingCase.defenderName}
                placeholder="Fullt nafn"
                autoComplete="off"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'defenderName',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'defenderName',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
              />
            </Box>
            <Box marginBottom={2}>
              <Input
                name="defenderEmail"
                label={`Netfang ${
                  workingCase.defenderIsSpokesperson ? 'talsmanns' : 'verjanda'
                }`}
                defaultValue={workingCase.defenderEmail}
                placeholder="Netfang"
                autoComplete="off"
                errorMessage={defenderEmailEM}
                hasError={defenderEmailEM !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'defenderEmail',
                    event,
                    ['email-format'],
                    workingCase,
                    setWorkingCase,
                    defenderEmailEM,
                    setDefenderEmailEM,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'defenderEmail',
                    event.target.value,
                    ['email-format'],
                    workingCase,
                    updateCase,
                    setDefenderEmailEM,
                  )
                }
              />
            </Box>
            <InputMask
              mask="999-9999"
              maskPlaceholder={null}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'defenderPhoneNumber',
                  event,
                  ['phonenumber'],
                  workingCase,
                  setWorkingCase,
                  defenderPhoneNumberEM,
                  setDefenderPhoneNumberEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'defenderPhoneNumber',
                  event.target.value,
                  ['phonenumber'],
                  workingCase,
                  updateCase,
                  setDefenderPhoneNumberEM,
                )
              }
            >
              <Input
                name="defenderPhoneNumber"
                label={`Símanúmer ${
                  workingCase.defenderIsSpokesperson ? 'talsmanns' : 'verjanda'
                }`}
                defaultValue={workingCase.defenderPhoneNumber}
                placeholder="Símanúmer"
                autoComplete="off"
                errorMessage={defenderPhoneNumberEM}
                hasError={defenderPhoneNumberEM !== ''}
              />
            </InputMask>
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_OVERVIEW_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextIsDisabled={!isValid || !courtDateIsValid}
          nextButtonText="Staðfesta og senda"
        />
      </FormContentContainer>
    </>
  )
}

export default HearingArrangementsForm

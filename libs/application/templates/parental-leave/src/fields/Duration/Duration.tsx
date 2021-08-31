import React, { FC, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import addMonths from 'date-fns/addMonths'
import formatISO from 'date-fns/formatISO'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import * as Sentry from '@sentry/react'

import {
  extractRepeaterIndexFromField,
  FieldBaseProps,
  getValueViaPath,
  RecordObject,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import Slider from '../components/Slider'
import { getExpectedDateOfBirth } from '../../lib/parentalLeaveUtils'
import { errorMessages, parentalLeaveFormMessages } from '../../lib/messages'
import { usageMaxMonths, usageMinMonths } from '../../config'
import { StartDateOptions } from '../../constants'
import { monthsToDays } from '../../lib/directorateOfLabour.utils'
import { useGetOrRequestEndDates } from '../../hooks/useGetOrRequestEndDates'
import * as styles from './Duration.treat'

const df = 'yyyy-MM-dd'
const DEFAULT_PERIOD_LENGTH = 1
const DEFAULT_PERIOD_PERCENTAGE = 100

export const Duration: FC<FieldBaseProps> = ({
  field,
  application,
  setFieldLoadingState,
  errors,
}) => {
  const { id } = field
  const { register, setError, clearErrors } = useFormContext()
  const { formatMessage, formatDateFns } = useLocale()
  const { answers } = application
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const currentRepeaterIndex = extractRepeaterIndexFromField(field)
  const currentIndex = currentRepeaterIndex === -1 ? 0 : currentRepeaterIndex
  const currentStartDateAnswer = getValueViaPath(
    answers,
    `periods[${currentIndex}].startDate`,
    expectedDateOfBirth,
  ) as string
  const currentEndDateAnswer = getValueViaPath(
    answers,
    id,
    formatISO(
      addMonths(parseISO(currentStartDateAnswer), DEFAULT_PERIOD_LENGTH),
    ),
  ) as string

  // Use the duration already persisted if available
  const monthsToUse = getValueViaPath(
    answers,
    `periods[${currentIndex}].duration`,
    DEFAULT_PERIOD_LENGTH,
  ) as number

  const percentageForPeriod = getValueViaPath(
    answers,
    `periods[${currentIndex}].percentage`,
    DEFAULT_PERIOD_PERCENTAGE,
  ) as number

  const [chosenEndDate, setChosenEndDate] = useState<string>(
    currentEndDateAnswer,
  )
  const [chosenDuration, setChosenDuration] = useState<number>(monthsToUse)
  const [durationInDays, setDurationInDays] = useState<number>(
    monthsToDays(monthsToUse),
  )
  const [percent, setPercent] = useState<number>(percentageForPeriod)
  const { getEndDate, loading } = useGetOrRequestEndDates(application)
  const errorMessage = (errors?.component as RecordObject<string>)?.message

  const monthsToEndDate = async (duration: number) => {
    try {
      const days = monthsToDays(duration)

      const endDateResult = await getEndDate({
        startDate: currentStartDateAnswer,
        length: days,
      })

      const date = new Date(endDateResult.date)

      setChosenEndDate(date.toISOString())
      setPercent(endDateResult.percentage)
      setDurationInDays(endDateResult.days)

      return date
    } catch (e) {
      Sentry.captureException(e.message)

      setError('component', {
        type: 'error',
        message: formatMessage(errorMessages.durationPeriods),
      })
    }
  }

  const handleChange = async (months: number) => {
    clearErrors([id, 'component'])
    setChosenDuration(months)
  }

  const handleChangeEnd = async (
    months: number,
    onChange: (...event: any[]) => void,
  ) => {
    const date = await monthsToEndDate(months)

    if (date) {
      onChange(format(date, df))
    }
  }

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading])

  useEffect(() => {
    const init = async () => {
      await monthsToEndDate(DEFAULT_PERIOD_LENGTH)
    }

    init()
  }, [])

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.duration.monthsDescription,
        )}
      />

      <Box
        background="blue100"
        paddingTop={6}
        paddingBottom={4}
        paddingX={3}
        marginTop={3}
      >
        <Controller
          defaultValue={chosenEndDate}
          name={id}
          render={({ onChange }) => (
            <Slider
              min={usageMinMonths}
              max={usageMaxMonths}
              trackStyle={{ gridTemplateRows: 8 }}
              calculateCellStyle={() => ({
                background: theme.color.dark200,
              })}
              showMinMaxLabels
              showToolTip
              label={{
                singular: formatMessage(parentalLeaveFormMessages.shared.month),
                plural: formatMessage(parentalLeaveFormMessages.shared.months),
              }}
              rangeDates={
                currentIndex === 0 &&
                answers.firstPeriodStart !==
                  StartDateOptions.ACTUAL_DATE_OF_BIRTH
                  ? {
                      start: {
                        date: formatDateFns(currentStartDateAnswer),
                        message: formatMessage(
                          parentalLeaveFormMessages.shared.rangeStartDate,
                        ),
                      },
                      end: {
                        date: chosenEndDate
                          ? formatDateFns(chosenEndDate)
                          : '—',
                        message: formatMessage(
                          parentalLeaveFormMessages.shared.rangeEndDate,
                        ),
                      },
                    }
                  : undefined
              }
              currentIndex={chosenDuration}
              onChange={(months: number) => handleChange(months)}
              onChangeEnd={(months: number) =>
                handleChangeEnd(months, onChange)
              }
            />
          )}
        />
      </Box>

      {errorMessage && (
        <Box
          paddingTop={2}
          className={styles.errorMessage}
          aria-live="assertive"
        >
          {errorMessage}
        </Box>
      )}

      <input
        ref={register}
        type="hidden"
        value={chosenDuration}
        name={`periods[${currentIndex}].duration`}
      />

      <input
        ref={register}
        type="hidden"
        value={durationInDays}
        name={`periods[${currentIndex}].days`}
      />

      <input
        ref={register}
        type="hidden"
        value={percent}
        name={`periods[${currentIndex}].percentage`}
      />
    </Box>
  )
}

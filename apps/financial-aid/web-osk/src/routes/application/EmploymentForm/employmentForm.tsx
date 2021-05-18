import React, { useEffect, useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './employmentForm.treat'
import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/types'

const EmploymentForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const employmentOptions = [
    {
      label: 'Ég er með atvinnu',
      value: 'employed',
    },
    {
      label: 'Ég er atvinnulaus',
      value: 'unemployed',
    },
    {
      label: 'Ég er ekki vinnufær',
      value: 'unableToWork',
    },
    {
      label: 'Ekkert að ofan lýsir minni stöðu',
      value: 'noneOfTheAbove',
    },
  ]

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hvað lýsir stöðu þinni best?
        </Text>

        <RadioButtonContainer
          options={employmentOptions}
          error={error && !form?.employment}
          isChecked={(value: string | number | boolean) => {
            return value === form?.employment
          }}
          onChange={(value: string | number | boolean) => {
            updateForm({ ...form, employment: value })
            if (error) {
              setError(false)
            }
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && !form?.employment,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að svara
          </Text>
        </div>

        <Box
          marginBottom={10}
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: form?.employment === 'noneOfTheAbove',
          })}
        >
          <Input
            backgroundColor={'blue'}
            label="Lýstu þinni stöðu"
            name="employmentCustom"
            rows={8}
            textarea
            value={form?.employmentCustom}
            hasError={error && !Boolean(form?.employmentCustom)}
            errorMessage="Þú þarft að fylla út"
            onChange={(event) => {
              updateForm({ ...form, employmentCustom: event.target.value })
            }}
          />
        </Box>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextIsDisabled={form?.employment === ''}
        onNextButtonClick={() => {
          if (form?.employment) {
            if (form?.employment !== 'noneOfTheAbove') {
              //Validation
              updateForm({ ...form, employmentCustom: '' })
              router.push(navigation?.nextUrl ?? '/')
            } else {
              if (Boolean(form?.employmentCustom)) {
                router.push(navigation?.nextUrl ?? '/')
              } else {
                setError(true)
              }
            }
          } else {
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default EmploymentForm
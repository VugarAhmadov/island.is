import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import * as styles from './homeCircumstancesForm.treat'
import cn from 'classnames'
import { NavigationProps } from '@island.is/financial-aid/types'

const HomeCircumstancesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const options = [
    {
      label: 'Ég bý í eigin húsnæði',
      value: 'ownPlace',
    },
    {
      label: 'Ég leigi með þinglýstan leigusamning',
      value: 'registeredLease',
    },
    {
      label: 'Ég bý eða leigi hjá öðrum án leigusamnings',
      value: 'registeredWithOutLease',
    },
    {
      label: 'Ég bý hjá foreldrum',
      value: 'withParents',
    },
    {
      label: 'Ekkert að ofan lýsir mínum aðstæðum',
      value: 'other',
    },
  ]

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hvernig býrðu?
        </Text>

        <RadioButtonContainer
          options={options}
          error={error && !form?.homeCircumstances}
          isChecked={(value: string | number | boolean) => {
            return value === form?.homeCircumstances
          }}
          onChange={(value: string | number | boolean) => {
            updateForm({ ...form, homeCircumstances: value })
            if (error) {
              setError(false)
            }
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && !form?.homeCircumstances,
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
            [`${styles.inputAppear}`]: form?.homeCircumstances === 'other',
          })}
        >
          <Input
            backgroundColor={'blue'}
            label="Lýstu þínum aðstæðum"
            name="homeCircumstancesCustom"
            rows={8}
            textarea
            value={form?.homeCircumstancesCustom}
            hasError={error && !Boolean(form?.homeCircumstancesCustom)}
            errorMessage="Þú þarft að fylla út"
            onChange={(event) => {
              updateForm({
                ...form,
                homeCircumstancesCustom: event.target.value,
              })
            }}
          />
        </Box>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        onNextButtonClick={() => {
          //Temperary error state
          //Check if any radio is checked
          if (form?.homeCircumstances && navigation?.nextUrl) {
            if (form?.homeCircumstances !== 'other') {
              //Validation
              updateForm({ ...form, homeCircumstancesCustom: '' })
              router.push(navigation?.nextUrl)
            } else {
              if (Boolean(form?.homeCircumstancesCustom)) {
                router.push(navigation?.nextUrl)
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

export default HomeCircumstancesForm
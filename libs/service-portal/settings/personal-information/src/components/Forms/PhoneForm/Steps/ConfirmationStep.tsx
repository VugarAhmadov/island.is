import React, { FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

export interface PhoneConfirmationFormData {
  code: string
  tel: string
}

interface Props {
  tel: string
  onSubmit: (data: PhoneConfirmationFormData) => void
  submitButtonText?: string | MessageDescriptor
  onBack: () => void
  loading: boolean
}

export const ConfirmationStep: FC<Props> = ({
  tel,
  onSubmit,
  submitButtonText,
  onBack,
  loading,
}) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors, reset } = useForm()

  useEffect(() => {
    if (tel.length > 0)
      reset({
        tel,
      })
  }, [tel])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          control={control}
          name="code"
          rules={{
            required: {
              value: true,
              message: formatMessage(m.verificationCodeRequired),
            },
          }}
          defaultValue={''}
          render={({ onChange, value, name }) => (
            <Input
              label={formatMessage(m.verificationCode)}
              placeholder={formatMessage(m.verificationCode)}
              name={name}
              value={value}
              hasError={errors.code}
              errorMessage={errors.code?.message}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="tel"
          defaultValue={tel}
          render={({ value, name }) => (
            <input type="hidden" name={name} value={value} />
          )}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        flexDirection={['columnReverse', 'row']}
        marginTop={4}
      >
        <Box marginTop={[1, 0]}>
          <Button variant="ghost" onClick={onBack}>
            {formatMessage(m.goBack)}
          </Button>
        </Box>
        <Button
          type="submit"
          variant="primary"
          icon="arrowForward"
          disabled={loading}
        >
          {formatMessage(
            submitButtonText
              ? submitButtonText
              : {
                  id: 'sp.settings:save-changes',
                  defaultMessage: 'Vista breytingar',
                },
          )}
        </Button>
      </Box>
    </form>
  )
}

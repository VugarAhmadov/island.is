import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  GridColumn,
  GridRow,
  Input,
  Stack,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  FileUploadController,
  RadioController,
} from '@island.is/shared/form-fields'
import TextWithTooltip from '../TextWithTooltip/TextWithTooltip'
import { YES, NO, FILE_SIZE_LIMIT } from '../../shared'
import { m } from '../../forms/messages'
import {
  FormerInsurance as FormerInsuranceType,
  ReviewFieldProps,
} from '../../types'
import {
  requireConfirmationOfResidency,
  extractKeyFromStringObject,
} from '../../healthInsuranceUtils'

const FormerInsurance: FC<ReviewFieldProps> = ({
  application,
  isEditable,
  field,
  error,
}) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const [entitlement, setEntitlement] = useState(
    getValueViaPath(
      application.answers,
      'formerInsurance.entitlement',
    ) as string,
  )

  const defaultValues = getValueViaPath(
    application.answers,
    'formerInsurance',
  ) as FormerInsuranceType

  return (
    <Box>
      <Stack space={2}>
        <Stack space={2}>
          <Text marginBottom={1}>
            {formatText(
              m.formerInsuranceRegistration,
              application,
              formatMessage,
            )}
          </Text>
          <RadioController
            id="formerInsurance.registration"
            name="formerInsurance.registration"
            disabled={!isEditable}
            largeButtons={true}
            options={[
              {
                label: formatText(
                  m.formerInsuranceNoOption,
                  application,
                  formatMessage,
                ),
                value: NO,
              },
              {
                label: formatText(m.yesOptionLabel, application, formatMessage),
                value: YES,
              },
            ]}
          />
        </Stack>
        <Stack space={2}>
          <FieldDescription
            description={formatText(
              m.formerInsuranceDetails,
              application,
              formatMessage,
            )}
          />
          <GridRow>
            <GridColumn span="12/12">
              <Input
                id=""
                name=""
                label={formatText(
                  m.formerInsuranceCountry,
                  application,
                  formatMessage,
                )}
                ref={register}
                disabled={!isEditable}
                backgroundColor="white"
                value={extractKeyFromStringObject(
                  defaultValues.country,
                  'name',
                )}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '6/12']}>
              <Input
                id="formerInsurance.personalId"
                name="formerInsurance.personalId"
                label={formatText(
                  m.formerPersonalId,
                  application,
                  formatMessage,
                )}
                ref={register}
                disabled={!isEditable}
                backgroundColor="blue"
                defaultValue={defaultValues.personalId}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Box marginTop={[2, 0]}>
                <Input
                  id="formerInsurance.institution"
                  name="formerInsurance.institution"
                  label={formatText(
                    m.formerInsuranceInstitution,
                    application,
                    formatMessage,
                  )}
                  ref={register}
                  disabled={!isEditable}
                  backgroundColor="blue"
                  defaultValue={defaultValues?.institution}
                />
              </Box>
            </GridColumn>
          </GridRow>
          {requireConfirmationOfResidency(defaultValues.country) && (
            <>
              <FieldDescription
                description={formatText(
                  m.confirmationOfResidencyFileUpload,
                  application,
                  formatMessage,
                )}
              />
              <FileUploadController
                id="formerInsurance.confirmationOfResidencyDocument"
                application={application}
                error={error}
                maxSize={FILE_SIZE_LIMIT}
                header={formatText(
                  m.fileUploadHeader,
                  application,
                  formatMessage,
                )}
                description={formatText(
                  m.fileUploadDescription,
                  application,
                  formatMessage,
                )}
                buttonLabel={formatText(
                  m.fileUploadButton,
                  application,
                  formatMessage,
                )}
              />
            </>
          )}
        </Stack>
        <Box marginBottom={4}>
          <TextWithTooltip
            application={application}
            field={field}
            title={formatText(
              m.formerInsuranceEntitlement,
              application,
              formatMessage,
            )}
            description={formatText(
              m.formerInsuranceEntitlementTooltip,
              application,
              formatMessage,
            )}
          />
        </Box>
        <RadioController
          id="formerInsurance.entitlement"
          name="formerInsurance.entitlement"
          onSelect={(value) => setEntitlement(value as string)}
          disabled={!isEditable}
          largeButtons={true}
          split="1/2"
          options={[
            {
              label: formatText(m.noOptionLabel, application, formatMessage),
              value: NO,
            },
            {
              label: formatText(m.yesOptionLabel, application, formatMessage),
              value: YES,
            },
          ]}
        />
        {entitlement === YES && (
          <Box marginBottom={[2, 2, 4]}>
            <Input
              id="formerInsurance.entitlementReason"
              name="formerInsurance.entitlementReason"
              label={formatText(
                m.formerInsuranceAdditionalInformation,
                application,
                formatMessage,
              )}
              placeholder={formatText(
                m.formerInsuranceAdditionalInformationPlaceholder,
                application,
                formatMessage,
              )}
              ref={register}
              disabled={!isEditable}
              backgroundColor="blue"
              textarea={true}
              defaultValue={defaultValues?.entitlementReason}
              rows={4}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default FormerInsurance

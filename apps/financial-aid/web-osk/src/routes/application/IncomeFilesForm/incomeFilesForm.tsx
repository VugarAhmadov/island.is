import React, { useEffect, useContext } from 'react'
import { Text, InputFileUpload } from '@island.is/island-ui/core'

import {
  FileUploadContainer,
  ContentContainer,
  Footer,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'

const IncomeFilesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useFileUpload(form.incomeFiles)

  useEffect(() => {
    const formFiles = files.filter((f) => f.status === 'done')

    updateForm({ ...form, incomeFiles: formFiles })
  }, [files])

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const errorCheck = () => {
    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Tekjugögn
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Við þurfum að sjá gögn um tekjur í þessum og síðasta mánuði. Þú getur
          smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í
          heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá.
        </Text>

        <FileUploadContainer>
          <InputFileUpload
            fileList={files}
            header="Dragðu gögn hingað"
            description="Tekið er við öllum hefðbundnum skráargerðum"
            buttonLabel="Bættu við gögnum"
            showFileSize={true}
            errorMessage={uploadErrorMessage}
            onChange={onChange}
            onRemove={onRemove}
            onRetry={onRetry}
          />
        </FileUploadContainer>
      </ContentContainer>

      <Footer
        prevButtonText="Til baka"
        previousUrl={navigation?.prevUrl}
        nextButtonText={
          files.length > 0 ? 'Halda áfram' : 'Skila gögnum seinna'
        }
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default IncomeFilesForm

import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, GridContainer, FormStepper } from '@island.is/island-ui/core'

import * as styles from './FormLayout.treat'

import {
  LogoHfj,
  Login,
  HasApplied,
} from '@island.is/financial-aid-web/osk/src/components'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

interface Props {
  children: ReactNode
  activeSection?: number
  activeSubSection?: number
}

const FormLayout = ({ children, activeSection, activeSubSection }: Props) => {
  const { isAuthenticated, user } = useContext(UserContext)

  const { form } = useContext(FormContext)
  const sections = useNavigationTree(Boolean(form?.hasIncome))

  useEffect(() => {
    if (activeSection !== undefined) {
      document.title = 'Umsókn - ' + sections[activeSection].name ?? ''
    } else {
      document.title = 'Umsókn um fjárhagsaðstoð'
    }
  }, [activeSection])

  if (!isAuthenticated) {
    return <Login headline="Skráðu þig inn" />
  }
  if (!user) {
    return null
  }

  return (
    <Box
      paddingY={[3, 3, 3, 6]}
      background="purple100"
      className={styles.processContainer}
    >
      {user.currentApplication ? (
        <HasApplied />
      ) : (
        <GridContainer className={styles.gridContainer}>
          <div className={styles.gridRowContainer}>
            <Box
              background="white"
              borderColor="white"
              borderRadius="large"
              className={styles.formContainer}
            >
              {children}
            </Box>
            <Box className={styles.sidebarContent}>
              <Box paddingLeft={[0, 0, 0, 3]}>
                {activeSection != undefined && (
                  <FormStepper
                    sections={sections}
                    activeSection={activeSection}
                    activeSubSection={activeSubSection}
                  />
                )}
              </Box>

              <LogoHfj className={styles.logo} />
            </Box>
          </div>
        </GridContainer>
      )}
    </Box>
  )
}

export default FormLayout

import {
  Button,
  CancelButton,
  Illustration,
  Onboarding
} from '@island.is/island-ui-native'
import {
  authenticateAsync,
  AuthenticationType,
  isEnrolledAsync
} from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { AppState, Platform } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import {
  preferencesStore,
  usePreferencesStore
} from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'


export function useBiometricType(type: AuthenticationType[]) {
  const intl = useIntl()
  if (type.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    if (Platform.OS === 'ios') {
      return intl.formatMessage({ id: 'onboarding.biometrics.type.faceId' })
    } else {
      return intl.formatMessage({
        id: 'onboarding.biometrics.type.facialRecognition',
      })
    }
  } else if (type.includes(AuthenticationType.FINGERPRINT)) {
    return intl.formatMessage({ id: 'onboarding.biometrics.type.fingerprint' })
  } else if (type.includes(AuthenticationType.IRIS)) {
    return intl.formatMessage({ id: 'onboarding.biometrics.type.iris' })
  }

  return ''
}

export const OnboardingBiometricsScreen: NavigationFunctionComponent<{
  hasHardware: boolean
  isEnrolled: boolean
  supportedAuthenticationTypes: AuthenticationType[]
}> = (props) => {
  const [isEnrolled, setIsEnrolled] = useState(props.isEnrolled)
  const { setUseBiometrics } = usePreferencesStore()
  const biometricType = useBiometricType(props.supportedAuthenticationTypes)
  const intl = useIntl()

  useEffect(() => {
    // check screen active states
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // user may be coming back from settings where they were trying to
        // enroll into biometrics.
        isEnrolledAsync().then(setIsEnrolled)
      }
    })
  }, [])

  const onBiometricsPress = () => {
    // check to see if we want to prompt
    authenticateAsync().then((authenticate) => {
      if (authenticate.success) {
        setUseBiometrics(true)
        preferencesStore.setState(() => ({ hasOnboardedBiometrics: true }))
        nextOnboardingStep()
      }
    })
  }

  const onCancelPress = () => {
    preferencesStore.setState(() => ({ hasOnboardedBiometrics: true }))
    nextOnboardingStep()
  }

  return (
    <Onboarding
      testID={testIDs.SCREEN_ONBOARDING_BIOMETRICS}
      title={
        isEnrolled ? (
          <FormattedMessage
            id="onboarding.biometrics.title"
            values={{ biometricType }}
          />
        ) : (
          <FormattedMessage
            id="onboarding.biometrics.notEnrolled"
            values={{ biometricType }}
          />
        )
      }
      illustration={<Illustration />}
      buttonSubmit={
        <Button
          testID={testIDs.ONBOARDING_BIOMETRICS_USE_BUTTON}
          title={intl.formatMessage(
            { id: 'onboarding.biometrics.useBiometricsButtonText' },
            { biometricType },
          )}
          onPress={onBiometricsPress}
          disabled={!isEnrolled}
        />
      }
      buttonCancel={
        <CancelButton
          title={<FormattedMessage id="onboarding.biometrics.skipButtonText" />}
          onPress={onCancelPress}
          testID={testIDs.ONBOARDING_BIOMETRICS_CANCEL_BUTTON}
        />
      }
    />
  )
}

OnboardingBiometricsScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  },
}
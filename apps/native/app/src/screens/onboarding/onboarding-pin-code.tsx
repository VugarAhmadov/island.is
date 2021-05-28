import React, { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { Image, SafeAreaView, View } from 'react-native'
import Keychain from 'react-native-keychain'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import logo from '../../assets/logo/logo-64w.png'
import { PinKeypad } from '../../components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '../../components/visualized-pin-code/visualized-pin-code'
import { preferencesStore } from '../../stores/preferences-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'

const Host = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.shade.background};
`

const Title = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 20px;
  color: ${(props) => props.theme.shade.foreground};
  margin-bottom: 10px;
  max-width: 75%;
  min-width: 360px;
  text-align: center;
`

const Subtitle = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 14px;
  min-height: 20px;
  color: ${(props) => props.theme.shade.foreground};
  max-width: 75%;
  text-align: center;
`

const Center = styled.View`
  justify-content: center;
  align-items: center;
`

const MAX_PIN_CHARS = 4

const CancelButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
`

const CancelText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.color.blue400};
`

export const OnboardingPinCodeScreen: NavigationFunctionComponent<{
  confirmPin?: string
  replacePin?: number
}> = ({ componentId, confirmPin, replacePin }) => {
  const intl = useIntl()
  const [code, setCode] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onPinInput = (char: string) => {
    setCode(
      (previousCode) =>
        `${previousCode}${previousCode.length >= MAX_PIN_CHARS ? '' : char}`,
    )
  }

  const onBackPress = () => {
    setCode(
      (previousCode) => `${previousCode.substr(0, previousCode.length - 1)}`,
    )
  }

  const onCancelPress = () => {
    if (confirmPin) {
      Navigation.pop(componentId)
    } else if (replacePin) {
      Navigation.dismissModal(componentId)
    }
  }

  useEffect(() => {
    if (code.length === MAX_PIN_CHARS) {
      if (confirmPin) {
        if (code === confirmPin) {
          Keychain.setGenericPassword('PIN_CODE', code, {
            service: 'PIN_CODE',
          }).then(() => {
            preferencesStore.setState(() => ({ hasOnboardedPinCode: true }))
            if (replacePin) {
              Navigation.dismissModal(componentId)
            } else {
              nextOnboardingStep()
            }
          })
        } else {
          setInvalid(true)
          setErrorMessage(
            intl.formatMessage({
              id: 'onboarding.pinCode.nonMatchingPinCodes',
            }),
          )
          setTimeout(() => {
            setInvalid(false)
            setCode('')
          }, 660)
        }
      } else {
        setTimeout(() => {
          setCode('')
          Navigation.push(componentId, {
            component: {
              name: ComponentRegistry.OnboardingPinCodeScreen,
              passProps: {
                confirmPin: code,
                replacePin,
              },
            },
          })
        }, 110)
      }
    } else if (code.length >= 1) {
      setErrorMessage('')
    }
  }, [code])

  return (
    <Host
      testID={
        confirmPin
          ? testIDs.SCREEN_ONBOARDING_CONFIRM_PIN
          : testIDs.SCREEN_ONBOARDING_ENTER_PIN
      }
    >
      <SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 20,
            maxHeight: 200,
            flex: 1,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45, marginBottom: 16 }}
          />
          <Title>
            {confirmPin ? (
              <FormattedMessage id="onboarding.pinCode.confirmPin" />
            ) : (
              <FormattedMessage id="onboarding.pinCode.enterPin" />
            )}
          </Title>
          <Subtitle>{errorMessage}</Subtitle>
        </View>
        <Center>
          <VisualizedPinCode
            code={code}
            invalid={invalid}
            maxChars={MAX_PIN_CHARS}
            style={{ marginBottom: 20 }}
          />
          <PinKeypad
            onInput={onPinInput}
            onBackPress={onBackPress}
            back={code.length > 0}
            faceId={false}
          />
          <View
            style={{
              height: 64,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            {(confirmPin || replacePin) && (
              <CancelButton
                onPress={onCancelPress}
                testID={testIDs.ONBOARDING_CONFIRM_PIN_CANCEL}
              >
                <CancelText>
                  {confirmPin ? (
                    <FormattedMessage id="onboarding.pinCode.goBackButtonText" />
                  ) : (
                    <FormattedMessage id="onboarding.pinCode.cancelButtonText" />
                  )}
                </CancelText>
              </CancelButton>
            )}
          </View>
        </Center>
      </SafeAreaView>
    </Host>
  )
}

OnboardingPinCodeScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  }
}
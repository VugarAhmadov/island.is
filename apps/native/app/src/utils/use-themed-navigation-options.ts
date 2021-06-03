import { defaultsDeep } from 'lodash'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { DynamicColorIOS } from 'react-native'
import { Options } from 'react-native-navigation'
import { useNavigation } from 'react-native-navigation-hooks/dist'
import { DefaultTheme, useTheme } from 'styled-components'
import { en } from '../messages/en'
import { is } from '../messages/is'
import { preferencesStore } from '../stores/preferences-store'
import { uiStore, useUiStore } from '../stores/ui-store'
import { createIntl, TypedIntlShape, useIntl } from '../utils/intl'
import { getThemeWithPreferences } from './get-theme-with-preferences'

type ApplyNavigationOptionsCallback = (
  theme: DefaultTheme,
  intl: TypedIntlShape,
  initialized: boolean,
) => Options

const defaultOptions = (
  theme: DefaultTheme,
  initialized: boolean,
  staticOptions: Options,
): Options => {
  const options: Options = {}

  if (Platform.OS === 'android') {
    options.layout = {
      backgroundColor: theme.shade.background,
      componentBackgroundColor: theme.shade.background,
    };
  }

  if (staticOptions.bottomTab) {
    options.bottomTab = {
      iconColor: !initialized
        ? theme.shade.background
        : theme.shade.foreground,
      selectedIconColor: theme.color.blue400,
      textColor: Platform.OS === 'android' ? theme.shade.foreground : DynamicColorIOS({ light: 'black', dark: 'white' }),
      selectedTextColor: Platform.OS === 'android' ? theme.shade.foreground : DynamicColorIOS({ light: 'black', dark: 'white' }),
    }
    if (Platform.OS === 'android') {
      options.bottomTabs = {
        backgroundColor: theme.shade.background,
      };
    }
  }

  if (staticOptions.topBar) {
    options.topBar = {
      title: {
        color: Platform.OS === 'android' ? theme.shade.foreground : DynamicColorIOS({ light: 'black', dark: 'white' }),
      },
      noBorder: true,
    }
    if (Platform.OS === 'android') {
      options.topBar.background = {
        color: theme.shade.background,
      }
    }
  }

  return options
}

export const useThemedNavigationOptions = (
  callback?: ApplyNavigationOptionsCallback,
  staticOptions: Options = {},
) => {
  return {
    useNavigationOptions(componentId: string) {
      const theme = useTheme()
      const intl = useIntl()
      const { initializedApp } = useUiStore()
      const { mergeOptions } = useNavigation(componentId)
      useEffect(() => {
        const optionsToUpdate = callback?.(theme, intl, initializedApp)
        defaultsDeep(
          optionsToUpdate,
          staticOptions,
          defaultOptions(theme, initializedApp, staticOptions),
        )
        if (optionsToUpdate) {
          mergeOptions(optionsToUpdate)
        }
      }, [callback, theme, intl, initializedApp])
    },
    getNavigationOptions() {
      const preferences = preferencesStore.getState()
      const { initializedApp } = uiStore.getState()
      const theme = getThemeWithPreferences({
        appearanceMode: preferences.appearanceMode,
      })
      const intl = createIntl({
        locale: preferences.locale,
        messages: preferences.locale === 'en-US' ? en : is,
      })
      const optionsToUpdate = callback?.(theme, intl, initializedApp) ?? {}
      return defaultsDeep(
        optionsToUpdate,
        staticOptions,
        defaultOptions(theme, initializedApp, staticOptions),
      )
    },
  }
}
import AsyncStorage from '@react-native-community/async-storage'
import RNLocalize from 'react-native-localize'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create, { State } from 'zustand/vanilla'
import { zustandFlipper } from '../utils/devtools/flipper-zustand'

export type Locale = 'en-US' | 'is-IS'
export type ThemeMode = 'dark' | 'light' | 'efficient';
export type AppearanceMode = ThemeMode | 'automatic'

export interface PreferencesStore extends State {
  dev__useLockScreen: boolean
  hasOnboardedPinCode: boolean
  hasOnboardedBiometrics: boolean
  hasOnboardedNotifications: boolean
  hasAcceptedNotifications: boolean
  dismissed: string[]
  useBiometrics: boolean
  locale: Locale
  appearanceMode: AppearanceMode
  appLockTimeout: number
  setLocale(locale: Locale): void
  setAppearanceMode(appearanceMode: AppearanceMode): void
  setUseBiometrics(useBiometrics: boolean): void
  dismiss(key: string, value?: boolean): void
  reset(): void
}

const availableLocales: Locale[] = ['en-US', 'is-IS']
const bestAvailableLanguage = RNLocalize.findBestAvailableLanguage(
  availableLocales,
)?.languageTag
const defaultPreferences = {
  appearanceMode: 'automatic',
  locale: bestAvailableLanguage || 'is-IS',
  useBiometrics: false,
  dev__useLockScreen: true,
  hasOnboardedBiometrics: false,
  hasOnboardedPinCode: false,
  hasOnboardedNotifications: false,
  hasAcceptedNotifications: false,
  dismissed: [] as string[],
  appLockTimeout: 5000,
}

export const preferencesStore = create<PreferencesStore>(
  persist(
    (set, get) => ({
      ...(defaultPreferences as PreferencesStore),
      setLocale(locale: Locale) {
        if (!availableLocales.includes(locale)) {
          throw new Error('Not supported locale')
        }
        set({ locale })
      },
      setAppearanceMode(appearanceMode: AppearanceMode) {
        set({ appearanceMode })
      },
      setUseBiometrics(useBiometrics: boolean) {
        set({ useBiometrics })
      },
      dismiss(key: string, value: boolean = true) {
        const now = get().dismissed
        if (value) {
          set({ dismissed: [...now, key] })
        } else {
          set({ dismissed: [...now.filter((k) => k !== key)] })
        }
      },
      reset() {
        set(defaultPreferences as PreferencesStore)
      },
    }),
    {
      name: 'preferences03',
      getStorage: () => AsyncStorage,
    },
  ),
)

export const usePreferencesStore = createUse(preferencesStore)

zustandFlipper(preferencesStore, 'PreferencesStore');
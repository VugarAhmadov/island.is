import React, { createContext, useState, useEffect } from 'react'
import { IntlProvider } from 'react-intl'
import { useApolloClient } from '@apollo/client/react'
import gql from 'graphql-tag'
import difference from 'lodash/difference'
import isEmpty from 'lodash/isEmpty'
import { polyfill } from './polyfills'

export type Locale = 'is' | 'en'

export const supportedLocales: Locale[] = ['is', 'en']
export const defaultLanguage: Locale = 'is'

export const isLocale = (value: string): value is Locale => {
  return supportedLocales.includes(value as Locale)
}

export interface MessagesDict {
  [key: string]: string
}

interface LocaleContextType {
  lang: Locale
  loadMessages: (namespaces: string | string[]) => void
  changeLanguage: (lang: Locale) => void
  loadingMessages: boolean
  loadedNamespaces: string[]
  messages: MessagesDict
}

interface LocaleProviderProps {
  locale: Locale
  messages: MessagesDict
  children: React.ReactElement
}

type Query = {
  getTranslations: Record<string, string>
}

export const LocaleContext = createContext<LocaleContextType>({
  lang: 'is',
  loadMessages: () => undefined,
  changeLanguage: () => undefined,
  loadingMessages: true,
  loadedNamespaces: [],
  messages: {},
})

const GET_TRANSLATIONS = gql`
  query GetTranslations($input: GetTranslationsInput!) {
    getTranslations(input: $input)
  }
`

export const LocaleProvider = ({
  children,
  locale = defaultLanguage,
  messages = {},
}: LocaleProviderProps) => {
  const [ready, setReady] = useState<boolean>(false)
  const [activeLocale, setActiveLocale] = useState<Locale>(
    locale || defaultLanguage,
  )
  const [messagesDict, setMessagesDict] = useState<MessagesDict>(messages)
  const [loadedNamespaces, setLoadedNamespaces] = useState<string[]>([])
  const apolloClient = useApolloClient()
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true
    async function prepare() {
      await polyfill(locale)
    }

    if (!ready) {
      prepare().then(() => {
        if (mounted) {
          setReady(true)
        }
      })
    }
    return () => {
      mounted = false
    }
  }, [locale, ready])

  useEffect(() => {
    if (locale !== activeLocale) {
      setActiveLocale(locale)
      setMessagesDict(messages)
    }
  }, [locale])

  useEffect(() => {
    if (messages) {
      setMessagesDict((old) => Object.assign({}, old, messages))
    }
  }, [messages])

  async function changeLanguage(lang: Locale) {
    setLoadingMessages(true)
    await polyfill(lang)
    setActiveLocale(lang)
    const { data } = await apolloClient.query<Query>({
      query: GET_TRANSLATIONS,
      variables: {
        input: {
          namespaces: loadedNamespaces,
          lang,
        },
      },
    })

    setLoadingMessages(false)
    setMessagesDict((old) => Object.assign({}, old, data?.getTranslations))
  }

  const loadMessages = async (namespaces: string | string[]) => {
    const namespaceArr =
      typeof namespaces === 'string' ? [namespaces] : namespaces
    const diff = difference(namespaceArr, loadedNamespaces)

    // Only fetch namespaces that we have not fetched yet
    if (!isEmpty(diff)) {
      setLoadedNamespaces([...loadedNamespaces, ...diff])

      const { data } = await apolloClient.query<Query>({
        query: GET_TRANSLATIONS,
        variables: {
          input: {
            namespaces: diff,
            lang: activeLocale,
          },
        },
      })

      setLoadingMessages(false)
      setMessagesDict((old) => Object.assign({}, old, data?.getTranslations))
    }
  }

  return (
    <LocaleContext.Provider
      value={{
        lang: activeLocale,
        loadMessages,
        changeLanguage,
        loadingMessages: !ready || loadingMessages,
        loadedNamespaces,
        messages: messagesDict,
      }}
    >
      {ready && (
        <IntlProvider
          locale={activeLocale}
          messages={messagesDict}
          defaultLocale={defaultLanguage}
        >
          {children}
        </IntlProvider>
      )}
    </LocaleContext.Provider>
  )
}

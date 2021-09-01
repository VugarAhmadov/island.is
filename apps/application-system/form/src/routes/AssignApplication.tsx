import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ServerError, useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'
import * as Sentry from '@sentry/react'
import qs from 'qs'

import { ErrorShell, LoadingShell } from '@island.is/application/ui-shell'
import { ASSIGN_APPLICATION } from '@island.is/application/graphql'
import { getSlugFromType, coreErrorMessages } from '@island.is/application/core'

const parseGraphQLError = (
  error?: GraphQLError,
): (ServerError & Record<string, unknown>) | null => {
  if (!error) {
    return null
  }

  try {
    return JSON.parse(error.message)
  } catch {
    return null
  }
}

export const AssignApplication = () => {
  const location = useLocation()
  const history = useHistory()
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
  const isMissingToken = !queryParams.token
  const [assignApplication, { loading, error }] = useMutation(
    ASSIGN_APPLICATION,
    {
      onCompleted({ assignApplication }) {
        const { id, typeId } = assignApplication

        // fall back to application if for some reason we can not find the configuration
        const slug = getSlugFromType(typeId) || 'application'

        history.push(`../${slug}/${id}`)
      },
    },
  )

  useEffect(() => {
    const init = async () => {
      if (isMissingToken) {
        Sentry.captureMessage(
          `Missing token, cannot assign the application ${location.search}`,
        )

        return
      }

      const { token } = queryParams

      await assignApplication({
        variables: {
          input: {
            token,
          },
        },
      })
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <LoadingShell />
  }

  const graphQLError = parseGraphQLError(error?.graphQLErrors?.[0])
  const couldNotAssignApplication = !!error

  return (
    <>
      {isMissingToken && (
        <ErrorShell
          status={graphQLError?.statusCode}
          title={coreErrorMessages.isMissingTokenErrorTitle}
          subTitle={coreErrorMessages.isMissingTokenErrorDescription}
        />
      )}

      {couldNotAssignApplication && (
        <ErrorShell
          status={graphQLError?.statusCode}
          title={coreErrorMessages.couldNotAssignApplicationErrorTitle}
          subTitle={coreErrorMessages.couldNotAssignApplicationErrorDescription}
        />
      )}
    </>
  )
}

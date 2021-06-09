import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  useApolloClient,
  useQuery,
} from '@apollo/client'
import { useCallback } from 'react'

export const useLazyQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
) => {
  const client = useApolloClient()

  return useCallback(
    (variables: TVariables) =>
      client.query<TData, TVariables>({
        query,
        variables,
      }),
    [client],
  )
}
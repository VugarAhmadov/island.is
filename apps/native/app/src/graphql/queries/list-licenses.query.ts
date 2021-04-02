import { gql } from '@apollo/client';

export const LIST_LICENSES_QUERY = gql`
  query {
    listLicenses {
      id
      title
      type
      serviceProvider
    }
  }
`;
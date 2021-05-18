import { gql } from '@apollo/client'

export const GetApplicationQuery = gql`
  query GetApplicationQuery {
    applications {
      id
      nationalId
      name
      phoneNumber
      email
    }
  }
`

export const GetMunicipalityQuery = gql`
  query GetMunicipalityQuery($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      id
      name
      settings
    }
  }
`

// export const GetApplicationQuery = gql`
//   query GetApplicationQuery {
//     applications {
//       id
//       nationalId
//       name
//       phoneNumber
//       email
//     }
//   }
// `

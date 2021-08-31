import { gql } from '@apollo/client'

export const GetApplicationQuery = gql`
  query GetApplicantyQuery($input: ApplicationInput!) {
    application(input: $input) {
      id
      nationalId
      created
      modified
      name
      phoneNumber
      email
      homeCircumstances
      student
      employment
      hasIncome
      usePersonalTaxCredit
      bankNumber
      ledger
      accountNumber
      interview
      employmentCustom
      homeCircumstancesCustom
      files {
        applicationId
        name
        size
        created
      }
      state
      formComment
      studentCustom
      amount
      rejection
    }
  }
`
export const UpdateApplicationMutation = gql`
  mutation UpdateApplicationMutation($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      id
      modified
      state
      amount
    }
  }
`
export const GetApplicationsQuery = gql`
  query GetApplicationQuery {
    applications {
      id
      nationalId
      name
      phoneNumber
      email
      modified
      created
      state
    }
  }
`

export const GetApplicationFiltersQuery = gql`
  query GetApplicationFiltersQuery {
    applicationFilters {
      New
      InProgress
      DataNeeded
      Rejected
      Approved
    }
  }
`

export const CreateApplicationQuery = gql`
  mutation createApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
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

export const GetCurrentUserQuery = gql`
  query currentUserQuery {
    currentUser {
      name
    }
  }
`
export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      nationalId
      name
      phoneNumber
    }
  }
`

export const GetApplicationEventQuery = gql`
  query GetApplicationEventQuery($input: ApplicationEventInput!) {
    applicationEvents(input: $input) {
      id
      applicationId
      comment
      state
      created
    }
  }
`

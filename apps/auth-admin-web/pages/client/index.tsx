import ClientDTO from './../../entities/dtos/client-dto'
import ClientCreateForm from '../../components/Client/form/ClientCreateForm'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import { NextPageContext } from 'next'
import { withAuthentication } from './../../utils/auth.utils'
import ClientTabNav from './../../components/Client/nav/ClientTabNav'
import { ClientTab } from './../../entities/common/ClientTab'
import ClientBasicCreateForm from './../../components/Client/form/ClientBasicCreateForm'
import { Client } from './../../entities/models/client.model'

const Index: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ClientTab>(ClientTab.BasicForm)
  const handleCancel = () => {
    router.back()
  }

  const handleClientDetailedFormSaved = (clientSaved: ClientDTO) => {
    if (clientSaved.clientId) {
      router.push(`/client/${clientSaved.clientId}?step=2`)
    }
  }

  const handleClientBasicFormSaved = (clientSaved: Client) => {
    if (clientSaved.clientId) {
      if (
        clientSaved.clientType !== 'spa' &&
        clientSaved.clientType !== 'native'
      ) {
        router.push(`/client/${clientSaved.clientId}?step=9`)
      } else {
        router.push(`/client/${clientSaved.clientId}?step=10`)
      }
    }
  }

  const handleTabChange = (tab: ClientTab) => {
    setActiveTab(tab)
  }

  if (activeTab === ClientTab.BasicForm) {
    return (
      <ContentWrapper>
        <ClientTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
          <ClientBasicCreateForm
            handleCancel={handleCancel}
            client={new ClientDTO()}
            onNextButtonClick={handleClientBasicFormSaved}
          ></ClientBasicCreateForm>
        </ClientTabNav>
      </ContentWrapper>
    )
  } else {
    return (
      <ContentWrapper>
        <ClientTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
          <ClientCreateForm
            handleCancel={handleCancel}
            client={new ClientDTO()}
            onNextButtonClick={handleClientDetailedFormSaved}
          />
        </ClientTabNav>
      </ContentWrapper>
    )
  }
}
export default Index

export const getServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)

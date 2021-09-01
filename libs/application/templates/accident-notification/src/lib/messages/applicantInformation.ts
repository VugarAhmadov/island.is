import { defineMessages } from 'react-intl'

export const applicantInformation = {
  general: defineMessages({
    name: {
      id: 'an.application:applicantInfo.general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    title: {
      id: 'an.application:applicantInfogeneral.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
    description: {
      id: 'an.application:applicantInfo.general.description',
      defaultMessage:
        'Sjúkratryggingar Íslands þurfa þessar upplýsingar til þess að hægt sé að hafa samband við þig á meðan umsóknin er til meðferðar og upplýsa þig um ákvörðun stofnunarinnar.',
      description: `Sjúkratryggingar Íslands needs this information in order to be able to contact you while the application is being processed and inform you of the institution's decision.`,
    },
  }),
  labels: defineMessages({
    name: {
      id: 'an.application:applicantInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'an.application:applicantInfo.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'an.application:applicantInfo.labels.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: 'an.application:applicantInfo.abels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'an.application:applicantInfo.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'an.application:applicantInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:applicantInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
  }),
}

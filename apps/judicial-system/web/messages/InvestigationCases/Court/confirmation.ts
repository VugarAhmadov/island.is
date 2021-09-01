import { defineMessages } from 'react-intl'

export const icConfirmation = {
  sections: {
    accusedAppealDecision: defineMessages({
      disclaimer: {
        id:
          'judicial.system.investigation_cases:confirmation.accused_appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á yfirliti úrskurðar skrefi í rannsóknarheimildum',
      },
    }),
  },
  modal: defineMessages({
    text: {
      id: 'judicial.system.investigation_cases:confirmation.modal.text',
      defaultMessage:
        'Úrskurður hefur verið sendur á ákæranda, dómritara og dómara sem kvað upp úrskurð. Úrskurðir eru eingöngu sendir á verjanda eða talsmann varnaraðila séu þeir viðstaddir þinghald. \n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
      description:
        'Notaður sem texti í úrskurðar tilkynningaglugganum á staðfesingar skrefi í rannsóknarheimildum',
    },
  }),
}

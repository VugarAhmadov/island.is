import { defineMessages } from 'react-intl'

export const icRulingStepOne = {
  sections: {
    courtCaseFacts: defineMessages({
      tooltip: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_case_facts.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um málsatvik" titlinn á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    courtLegalArguments: defineMessages({
      tooltip: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_legal_arguments.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    decision: defineMessages({
      dismissLabel: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.decision.dismiss_label',
        defaultMessage: 'Kröfu vísað frá',
        description:
          'Notaður sem texti við radio takka með vali um að vísa máli frá á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
  },
}

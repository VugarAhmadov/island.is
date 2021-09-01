import { defineMessages } from 'react-intl'

export const icCourtRecord = {
  sections: {
    accusedAppealDecision: {
      options: defineMessages({
        accept: {
          id:
            'judicial.system.investigation_cases:court_record.accused_appeal_decision.options.accept',
          defaultMessage: 'Varnaraðili samþykkir kröfuna',
          description:
            'Notaður sem texti fyrir valmöguleikann "samþykkir kröfuna" í dómaraflæði í rannsóknarheimildum',
        },
        reject: {
          id:
            'judicial.system.investigation_cases:court_record.accused_appeal_decision.options.reject',
          defaultMessage: 'Varnaraðili mótmælir kröfunni',
          description:
            'Notaður sem texti fyrir valmöguleikann "hafnar kröfunni" í dómaraflæði í rannsóknarheimildum',
        },
        notApplicable: {
          id:
            'judicial.system.investigation_cases:court_record.accused_appeal_decision.options.not_applicable',
          defaultMessage: 'Á ekki við',
          description:
            'Notaður sem texti fyrir valmöguleikann "á ekki við" í dómaraflæði í rannsóknarheimildum',
        },
      }),
    },
    accusedPleaAnnouncement: defineMessages({
      placeholder: {
        id:
          'judicial.system.investigation_cases:court_record.accused_plea_announcement.tooltip',
        defaultMessage: 'Nánari útlistun á afstöðu sakbornings',
        description:
          'Notaður sem skýritexti í "afstaða kærða" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
  },
}

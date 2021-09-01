import { defineMessages } from 'react-intl'

export const rcCourtRecord = {
  sections: {
    accusedAppealDecision: {
      options: defineMessages({
        accept: {
          id:
            'judicial.system.restriction_cases:court_record.accused_appeal_decision.options.accept',
          defaultMessage: '{accusedType} samþykkir kröfuna',
          description:
            'Notaður sem texti fyrir valmöguleikann "samþykkir kröfuna" í dómaraflæði í gæsluvarðhalds- og farbannsmálum',
        },
        reject: {
          id:
            'judicial.system.restriction_cases:court_record.accused_appeal_decision.options.reject',
          defaultMessage: '{accusedType} mótmælir kröfunni',
          description:
            'Notaður sem texti fyrir valmöguleikann "hafnar kröfunni" í dómaraflæði í gæsluvarðhalds- og farbannsmálum',
        },
      }),
    },
    accusedPleaAnnouncement: defineMessages({
      placeholder: {
        id:
          'judicial.system.restriction_cases:court_record.accused_plea_announcement.tooltip',
        defaultMessage: 'Nánari útlistun á afstöðu sakbornings',
        description:
          'Notaður sem skýritexti í "afstaða kærða" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}

import { PublicDebtPaymentPlanAnswers } from '@island.is/application/templates/public-debt-payment-plan'
import { SendMailOptions } from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'
import {
  AssignmentEmailTemplateGenerator,
  EmailTemplateGeneratorProps,
} from '../../../../types'
import { pathToAsset } from '../public-debt-payment-plan.utils'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    attachments: Attachment[],
  ): SendMailOptions
}

export const generateConfirmationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { email },
  } = props

  const answers = application.answers as PublicDebtPaymentPlanAnswers
  const applicant = {
    name: answers.applicant.name,
    address: answers.applicant.email,
  }

  const subject = `Þér hefur borist yfirlit um greiðsluáætlun`

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: applicant,
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Image',
          context: {
            src: pathToAsset('notification.jpg'),
            alt: 'Fá skilaboð myndskreyting',
          },
        },
        {
          component: 'Heading',
          context: {
            copy: subject,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: 'Texti',
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Opna yfirlit',
            href: assignLink,
          },
        },
      ],
    },
  }
}

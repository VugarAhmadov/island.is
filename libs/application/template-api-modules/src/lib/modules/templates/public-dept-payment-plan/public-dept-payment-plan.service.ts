import { utils } from '@island.is/application/templates/accident-notification'
import { Inject, Injectable } from '@nestjs/common'
import { Attachment } from 'nodemailer/lib/mailer'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import type { PubliDeptPaymentPlanConfig } from './config'
import { PUBLIC_DEBT_PAYMENT_PLAN_CONFIG } from './config'
import {
  generateAssignReviewerEmail,
  generateConfirmationEmail,
} from './emailGenerators'

const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60

@Injectable()
export class PublicDebtPaymentPlanService {
  constructor(
    @Inject(PUBLIC_DEBT_PAYMENT_PLAN_CONFIG)
    private paymentPlanConfig: PubliDeptPaymentPlanConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const attachments = [] as Attachment[]
    const shouldRequestReview =
      !utils.isHomeActivitiesAccident(application.answers) &&
      !utils.isRepresentativeOfCompanyOrInstitute(application.answers)

    // Send confirmation email to applicant
    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.paymentPlanConfig.applicationSenderName,
          this.paymentPlanConfig.applicationSenderEmail,
          attachments,
        ),
      application,
    )

    // Request representative review when applicable
    if (shouldRequestReview) {
      await this.sharedTemplateAPIService.assignApplicationThroughEmail(
        generateAssignReviewerEmail,
        application,
        SIX_MONTHS_IN_SECONDS_EXPIRES,
      )
    }
  }
}

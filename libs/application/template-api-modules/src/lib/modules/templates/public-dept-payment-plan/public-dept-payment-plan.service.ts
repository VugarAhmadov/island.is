import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import type { PubliDeptPaymentPlanConfig } from './config'
import { PUBLIC_DEBT_PAYMENT_PLAN_CONFIG } from './config'
import { generateConfirmationEmail } from './emailGenerators'

const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60

@Injectable()
export class PublicDebtPaymentPlanService {
  constructor(
    @Inject(PUBLIC_DEBT_PAYMENT_PLAN_CONFIG)
    private paymentPlanConfig: PubliDeptPaymentPlanConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    // Send confirmation email to applicant
    /* await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.paymentPlanConfig.applicationSenderName,
          this.paymentPlanConfig.applicationSenderEmail,
          attachments,
        ),
      application,
    ) */

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateConfirmationEmail,
      application,
      SIX_MONTHS_IN_SECONDS_EXPIRES,
    )
  }
}

import { FileStorageModule } from '@island.is/file-storage'
import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { PUBLIC_DEBT_PAYMENT_PLAN_CONFIG } from './config'
import { PublicDebtPaymentPlanService } from './public-dept-payment-plan.service'
const applicationRecipientName =
  process.env.PUBLIC_DEBT_PAYMENT_PLAN_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.PUBLIC_DEBT_PAYMENT_PLAN_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class PublicDebtPaymentPlanModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PublicDebtPaymentPlanModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FileStorageModule.register({}),
      ],
      providers: [
        {
          provide: PUBLIC_DEBT_PAYMENT_PLAN_CONFIG,
          useValue: {
            applicationRecipientName,
            applicationRecipientEmail,
            applicationSenderName,
            applicationSenderEmail,
          },
        },
        PublicDebtPaymentPlanService,
      ],
      exports: [PublicDebtPaymentPlanService],
    }
  }
}

import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { FileStorageModule } from '@island.is/file-storage'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import { AccidentNotificationService } from './accident-notification.service'

const applicationRecipientName =
  process.env.ACCIDENT_NOTIFICATION_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.ACCIDENT_NOTIFICATION_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class AccidentNotificationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AccidentNotificationModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FileStorageModule.register({}),
      ],
      providers: [
        {
          provide: ACCIDENT_NOTIFICATION_CONFIG,
          useValue: {
            applicationRecipientName,
            applicationRecipientEmail,
            applicationSenderName,
            applicationSenderEmail,
          },
        },
        AccidentNotificationService,
      ],
      exports: [AccidentNotificationService],
    }
  }
}

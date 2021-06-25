import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TranslationsModule } from '@island.is/api/domains/translations'
import { AuditModule } from '@island.is/nest/audit'

import { Payment } from './payment.model'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { environment } from '../../../environments'
import { PaymentAPI, PAYMENT_OPTIONS } from '@island.is/clients/payment'
import { PaymentServiceOptions } from '@island.is/clients/payment'

export interface Config {
  clientConfig: PaymentServiceOptions
}

@Module({})
export class PaymentModule {
  static register(config: Config): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        PaymentService,
        {
          provide: PAYMENT_OPTIONS,
          useValue: config.clientConfig,
        },
        {
          provide: PaymentAPI,
          useFactory: () => {
            return new PaymentAPI(config.clientConfig)
          },
        },
      ],
      imports: [
        AuditModule.forRoot(environment.audit),
        SequelizeModule.forFeature([Payment]),
        TranslationsModule,
      ],
      controllers: [PaymentController],
      exports: [PaymentService],
    }
  }
}
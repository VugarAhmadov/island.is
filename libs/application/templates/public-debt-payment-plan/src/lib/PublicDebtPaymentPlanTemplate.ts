import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/core'
import { PublicDebtPaymentPlanSchema } from './dataSchema'
import { application } from './messages'

const States = {
  draft: 'draft',
  submitted: 'submitted',
}

type PublicDebtPaymentPlanEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

const PublicDebtPaymentPlanTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<PublicDebtPaymentPlanEvent>,
  PublicDebtPaymentPlanEvent
> = {
  type: ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN,
  name: application.name,
  institution: application.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.PublicDebtPaymentPlan.translation,
  ],
  dataSchema: PublicDebtPaymentPlanSchema,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: States.draft,
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 0.5,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true, // Only on dev
            whenToPrune: 12 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentPlanForm').then((module) =>
                  Promise.resolve(module.PaymentPlanForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.submitted,
          },
        },
      },
      [States.submitted]: {
        meta: {
          name: States.submitted,
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true, // Only on dev
            whenToPrune: 12 * 3600 * 1000,
          },
          /* roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentPlanSubmittedForm').then((module) =>
                  // TODO: Rename this once we start work on it
                  Promise.resolve(module.PaymentPlanSubmittedForm),
                ),
              write: 'all',
            },
          ], */
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default PublicDebtPaymentPlanTemplate

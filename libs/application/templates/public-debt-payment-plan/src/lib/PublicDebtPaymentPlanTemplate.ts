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
import { ApiActions } from '../shared/constants'
import { PublicDebtPaymentPlanSchema } from './dataSchema'
import { application } from './messages'

const States = {
  draft: 'draft',
  submitted: 'submitted',
  overview: 'overview',
}

type PublicDebtPaymentPlanEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
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
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentPlanSubmittedForm').then((module) => {
                  return Promise.resolve(module.PaymentPlanSubmittedForm)
                }),
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: {
            target: States.overview,
          },
        },
      },
      [States.overview]: {
        meta: {
          name: States.overview,
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
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentPlanSubmittedForm').then((module) => {
                  console.log('I am an applicant')
                  return Promise.resolve(module.PaymentPlanSubmittedForm)
                }),
              write: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/Overview').then((module) => {
                  console.log('I am an assignee')
                  return Promise.resolve(module.Overview)
                }),
              write: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    // If the applicant is its own employer, we need to give it the `ASSIGNEE` role to be able to continue the process
    if (id === application.applicant && application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    if (id === application.applicant) {
      return Roles.APPLICANT
    }

    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default PublicDebtPaymentPlanTemplate

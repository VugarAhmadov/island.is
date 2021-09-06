import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { application, section } from '../lib/messages'

export const Overview: Form = buildForm({
  id: 'Overview',
  title: application.name,
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'stepOne',
      title: section.confirmation,
      children: [
        buildCustomField({
          id: 'confirmationCustomField',
          title: 'Hey hoooo',
          component: 'SubmittedOverviewPreview',
        }),
      ],
    }),
  ],
})

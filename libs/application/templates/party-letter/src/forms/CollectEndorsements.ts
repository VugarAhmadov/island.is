import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildFileUploadField,
  buildCheckboxField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const CollectEndorsements: Form = buildForm({
  id: 'Collect endorsements',
  title: m.endorsementForm.title,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'endorsementSection',
      title: m.collectEndorsements.title,
      children: [
        buildMultiField({
          id: 'endorsementsfield',
          title: m.collectEndorsements.title,
          children: [
            buildCustomField({
              id: 'endorsements',
              title: m.collectEndorsements.title,
              component: 'EndorsementList',
            }),

            buildCheckboxField({
              id: 'includePapers',
              title: '',
              strong: true,
              options: [
                {
                  value: 'yes',
                  label: m.fileUpload.includePapers,
                },
              ],
              defaultValue: '',
            }),
            buildCustomField({
              id: 'fileUploadDisclaimer',
              title: m.collectEndorsements.title,
              component: 'FileUploadDisclaimer',
            }),
            buildFileUploadField({
              condition: (answer) => answer.includePapers !== undefined,
              id: 'documents',
              title: '',
              introduction: '',
              maxSize: 10000000,
              uploadAccept: '.xlsx',
              uploadHeader: m.fileUpload.fileUploadHeader,
              uploadDescription: m.fileUpload.uploadDescription,
              uploadButtonLabel: m.fileUpload.uploadButtonLabel,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'reviewApplication',
      title: m.overview.title,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: m.overview.title,
          description: m.overview.subtitle,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              title: '',
              component: 'Review',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.overview.title,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.overview.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: m.overview.finalTitle,
          component: 'PartyLetterApplicationApproved',
        }),
      ],
    }),
  ],
})

import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/template'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.EXAMPLE,
  ownerId: 'TODO?',
  name: 'Í vinnslu',
  mode: 'pending',
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: 'Í vinnslu',
      introduction: 'Umsókn þín um ökunám er nú í vinnslu. ',
    }),
  ],
})

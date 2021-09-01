import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const paymentPlan = {
  general: defineMessages({
    pageTitle: {
      id: `pdpp.application:section.paymentPlan.pageTitle`,
      defaultMessage: 'Yfirlit yfir skuldir ',
      description: 'Payment plan page title',
    },
    pageDescription: {
      id: `pdpp.application:section.paymentPlan.pageDescription`,
      defaultMessage: `Hér gefur að líta yfirlit yfir þær
      skuldir þar sem boðið er upp á greiðsludreifingu.
      Til að ganga frá greiðsludreifingu þarf að gera
      greiðsluáætlun fyrir allar útistandandi skuldir og undirrita áætlunina rafrænt.`,
    },
    paymentPlanDescription: {
      id: `pdpp.application:section.paymentPlan.paymentPlanDescription`,
      defaultMessage: 'Vinsamlegast veldu greiðslutímabil',
      description: 'Payment plan page description',
    },
    wageDeductionInfoPageTitle: {
      id: `pdpp.application:section.paymentPlan.wageDeductionInfoPageTitle`,
      defaultMessage: 'Upplýsingar um launaafdrátt',
      description: 'Payment plan wage deduction info page title',
    },
  }),
  labels: defineMessages({
    sentAsAClaim: {
      id: `pdpp.application:section.paymentPlan.sentAsAClaim`,
      defaultMessage: `Þessi skuld verður send sem krafa`,
      description: 'Notes that this payment will be sent as a claim',
    },
    deductedFromSalary: {
      id: `pdpp.application:section.paymentPlan.deductedFromSalary`,
      defaultMessage: `Þessi skuld verður dregin af launum`,
      description: `Notes that this payment will be deducted from the user's salary`,
    },
    totalAmount: {
      id: `pdpp.application:section.paymentPlan.totalAmount`,
      defaultMessage: `Heildarupphæð`,
      description: `Total amount label`,
    },
    moreInfo: {
      id: `pdpp.application:section.paymentPlan.moreInfo`,
      defaultMessage: `Nánari upplýsingar`,
      description: `More info label`,
    },
    feeCategory: {
      id: `pdpp.application:section.paymentPlan.feeCategory`,
      defaultMessage: `Gjaldflokkur`,
      description: `Fee category label`,
    },
    principal: {
      id: `pdpp.application:section.paymentPlan.principal`,
      defaultMessage: `Höfuðstóll`,
      description: `Principal amount label`,
    },
    interest: {
      id: `pdpp.application:section.paymentPlan.interest`,
      defaultMessage: `Vextir`,
      description: `Interest amount label`,
    },
    expense: {
      id: `pdpp.application:section.paymentPlan.expense`,
      defaultMessage: `Kostnaður`,
      description: `Expense label`,
    },
    editPaymentPlan: {
      id: `pdpp.application:section.paymentPlan.editPaymentPlan`,
      defaultMessage: `Breyta greiðsludreifingu`,
      description: `Edit payment plan label`,
    },
    paymentModeTitle: {
      id: `pdpp.application:section.paymentPlan.paymentModeTitle`,
      defaultMessage: `Veldu greiðsludreifingu skuldar`,
      description: `Payment mode label`,
    },
    payByAmount: {
      id: `pdpp.application:section.paymentPlan.payByAmount`,
      defaultMessage: `Velja eftir fjárhæð`,
      description: `Pay by amount radio label`,
    },
    payByMonths: {
      id: `pdpp.application:section.paymentPlan.payByMonths`,
      defaultMessage: `Velja fjölda mánaða`,
      description: `Pay by months label`,
    },
    chooseAmountPerMonth: {
      id: `pdpp.application:section.paymentPlan.chooseAmountPerMonth`,
      defaultMessage: `Veldu upphæðina sem þú vilt greiða á mánuði`,
      description: `Amount slider heading`,
    },
    chooseNumberOfMonths: {
      id: `pdpp.application:section.paymentPlan.chooseNumberOfMonths`,
      defaultMessage: `Veldu fjölda mánaða sem þú vilt dreifa á`,
      description: `Amount slider heading`,
    },
    wageDeductionPointOne: {
      id: `pdpp.application:section.paymentPlan.wageDeductionPointOne`,
      defaultMessage: `
        Þegar opinber gjöld (þing- og sveitarsjóðsgjöld) eru ógreidd er
        heimilt að beita launaafdrætti. Lögum samkvæmt er innheimtumanni
        heimilt að krefja vinnuveitanda um að halda eftir allt að
        75% af heildarlaunagreiðslum til launþega hverju sinni.
        Meginreglan er sú að innheimtumenn ríkissjóðs gera kröfu um
        75% launaafdrátt en launþegi heldur eftir 25% af heildarlaunagreiðslu.
      `,
      description: `Amount slider heading`,
    },
    wageDeductionPointTwo: {
      id: `pdpp.application:section.paymentPlan.wageDeductionPointTwo`,
      defaultMessage: `
        Hafi launagreiðandi þegar dregið fjárhæð af launum er hægt að
        senda launaseðil/seðla til viðkomandi innheimtumanns og hann sér
        um að innheimta gjöldin hjá launagreiðanda. Launaseðil/seðla
        skal senda á netfangið 7649@skatturinn.is. Einnig er hægt að senda
        fyrirspurn á sama netfang fyrir frekari upplýsingar um launaafdrát
        eða leita til viðkomandi sýslumanns ef lögheimili er ekki á höfuðborgarsvæðinu.
      `,
      description: `Amount slider heading`,
    },
    sliderDescriptor: {
      id: `pdpp.application:section.paymentPlan.sliderDescriptorEvenMonths`,
      defaultMessage: `
        {count, plural, =0 {Greiðsla {monthlyPayments} í {monthsAmount} mánuð.} one {Greiðsla {monthlyPayments} í {monthsAmount} mánuði.} other {Greiðsla {monthlyPayments} í {monthsAmount} mánuði og {lastMonthsPayment} á {lastMonth}. mánuði.}}
      `,
      description: `Slider descriptor`,
    },
    distributionDataTitle: {
      id: `pdpp.application:section.paymentPlan.distributionDataTitle`,
      defaultMessage: `
      Hér er hægt að sjá heildargreiðsluáætlun skuldar
      `,
      description: `Total distribution plan`,
    },
  }),
}

import PublicDebtPaymentPlanTemplate from './lib/PublicDebtPaymentPlanTemplate'
import { PublicDebtPaymentPlan } from './types'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export type PublicDebtPaymentPlanAnswers = PublicDebtPaymentPlan

export default PublicDebtPaymentPlanTemplate

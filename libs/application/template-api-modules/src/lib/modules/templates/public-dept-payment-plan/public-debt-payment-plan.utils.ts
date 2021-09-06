import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/public-debt-payment-plan/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./public-debt-payment-plan-assets/${file}`)
}

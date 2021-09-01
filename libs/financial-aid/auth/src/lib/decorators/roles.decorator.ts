import { SetMetadata } from '@nestjs/common'

import { RolesRule } from '@island.is/financial-aid/shared'

export const RolesRules = (...rules: RolesRule[]) =>
  SetMetadata('roles-rules', rules)

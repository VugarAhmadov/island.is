import { CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { GenericScope } from '@island.is/auth/scopes'
import { VoterRegistry } from './voterRegistry.model'
import { VoterRegistryService } from './voterRegistry.service'
import { environment } from '../../../environments'
import { FindOneDto } from './dto/findOne.dto'
import type { User } from '@island.is/auth-nest-tools'
@Audit<VoterRegistry>({
  namespace: `${environment.audit.defaultNamespace}/voter-registry`,
})
@Controller('voter-registry')
@ApiOAuth2([])
@ApiTags('temporaryVoterRegistry')
export class VoterRegistryController {
  constructor(private readonly voterRegistryService: VoterRegistryService) {}

  @ApiOkResponse({
    description: 'Finds voter registry entry given user authentication',
    type: VoterRegistry,
  })
  @Audit<VoterRegistry>({
    resources: (voterRegistry) => voterRegistry.id,
  })
  @Scopes(GenericScope.internal)
  @Get()
  async findByAuth(
    @CurrentUser() { nationalId }: User,
  ): Promise<VoterRegistry> {
    return await this.voterRegistryService.findByNationalId(nationalId)
  }

  @ApiOkResponse({
    description: 'Finds voter registry entry given users national id',
    type: VoterRegistry,
  })
  @Audit<VoterRegistry>({
    resources: (voterRegistry) => voterRegistry.id,
  })
  @Scopes(GenericScope.system)
  @Get('/system')
  async findByNationalId(
    @Query() { nationalId }: FindOneDto,
  ): Promise<VoterRegistry> {
    return await this.voterRegistryService.findByNationalId(nationalId)
  }
}

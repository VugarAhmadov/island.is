import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { JwtGraphQlAuthGuard } from '@island.is/judicial-system/auth'

import { BackendAPI } from '../../../services'
import { CreateApplicationFilesInput, GetSignedUrlInput } from './dto'
import { SignedUrlModel, CreateFilesModel } from './models'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class FileResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => SignedUrlModel)
  getSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<SignedUrlModel> {
    this.logger.debug('Creating signed url')
    return backendApi.getSignedUrl(input)
  }

  @Mutation(() => CreateFilesModel)
  async createApplicationFiles(
    @Args('input', { type: () => CreateApplicationFilesInput })
    input: CreateApplicationFilesInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<CreateFilesModel> {
    this.logger.debug('Creating application files')
    return await backendApi.createApplicationFiles(input)
  }
}

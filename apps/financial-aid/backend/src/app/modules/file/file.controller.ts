import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { CurrentHttpUser, JwtAuthGuard } from '@island.is/financial-aid/auth'
import type { User } from '@island.is/financial-aid/shared'

import { GetSignedUrlDto } from './dto'
import { SignedUrlModel } from './models'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard)
@Controller('api/file')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('url')
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  createSignedUrl(
    @CurrentHttpUser() user: User,
    @Body() getSignedUrl: GetSignedUrlDto,
  ): SignedUrlModel {
    return this.fileService.createSignedUrl(user.folder, getSignedUrl.fileName)
  }
}

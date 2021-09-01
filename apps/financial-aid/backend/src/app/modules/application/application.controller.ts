import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
  NotFoundException,
  Query,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'

import { ApplicationService } from './application.service'
import { CurrentApplicationModel, ApplicationModel } from './models'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  TokenGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/financial-aid/auth'

import type { User } from '@island.is/financial-aid/shared'

import { ApplicationFilters, RolesRule } from '@island.is/financial-aid/shared'

@Controller('api')
@ApiTags('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(TokenGuard)
  @Get('getCurrentApplication')
  @ApiOkResponse({
    type: CurrentApplicationModel,
    description: 'Checks if user has a current application for this period',
  })
  async getCurrentApplication(@Query('nationalId') nationalId: string) {
    return await this.applicationService.getCurrentApplication(nationalId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @Get('applications')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  getAll(): Promise<ApplicationModel[]> {
    return this.applicationService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Get application',
  })
  async getById(@Param('id') id: string) {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException(`application ${id} not found`)
    }

    return application
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @Get('applicationFilters')
  @ApiOkResponse({
    description: 'Gets all existing applications filters',
  })
  getAllFilters(): Promise<ApplicationFilters> {
    return this.applicationService.getAllFilters()
  }

  @UseGuards(JwtAuthGuard)
  @Put('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Updates an existing application',
  })
  async update(
    @Param('id') id: string,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<ApplicationModel> {
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, applicationToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    return updatedApplication
  }

  @UseGuards(JwtAuthGuard)
  @Post('application')
  @ApiCreatedResponse({
    type: ApplicationModel,
    description: 'Creates a new application',
  })
  create(
    @CurrentHttpUser() user: User,
    @Body() application: CreateApplicationDto,
  ): Promise<ApplicationModel> {
    return this.applicationService.create(application, user)
  }
}

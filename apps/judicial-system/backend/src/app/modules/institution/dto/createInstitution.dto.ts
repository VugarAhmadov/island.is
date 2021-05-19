import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateInstitutionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string
}
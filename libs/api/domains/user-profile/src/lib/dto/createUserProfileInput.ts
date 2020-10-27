import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { Locale } from '../types/locales.enum'

@InputType()
export class CreateUserProfileInput {
  //Pending AuthGuards
  @Field(() => String)
  @IsString()
  nationalId!: string

  @Field(() => String)
  @IsString()
  @IsOptional()
  mobilePhoneNumber?: string

  @Field(() => String)
  @IsEnum(Locale)
  @IsOptional()
  locale?: Locale

  @Field(() => String)
  @IsEmail()
  @IsOptional()
  email?: string
}

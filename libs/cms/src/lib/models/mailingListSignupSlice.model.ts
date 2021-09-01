import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IMailingListSignup } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class MailingListSignupSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  variant!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  inputLabel!: string

  @Field({ nullable: true })
  fullNameLabel!: string

  @Field({ nullable: true })
  questionLabel!: string

  @Field({ nullable: true })
  yesLabel!: string

  @Field({ nullable: true })
  noLabel!: string

  @Field({ nullable: true })
  disclaimerLabel!: string

  @Field()
  buttonText!: string

  @Field()
  signupUrl!: string
}

export const mapMailingListSignup = ({
  fields,
  sys,
}: IMailingListSignup): SystemMetadata<MailingListSignupSlice> => ({
  typename: 'MailingListSignupSlice',
  id: sys.id,
  title: fields.title ?? '',
  variant: fields.variant ?? '',
  description: fields.description ?? '',
  inputLabel: fields.inputLabel ?? '',
  fullNameLabel: fields.fullNameLabel ?? '',
  questionLabel: fields.questionLabel ?? '',
  yesLabel: fields.yesLabel ?? '',
  noLabel: fields.noLabel ?? '',
  disclaimerLabel: fields.disclaimerLabel ?? '',
  buttonText: fields.buttonText ?? '',
  signupUrl: fields.signupUrl ?? '',
})

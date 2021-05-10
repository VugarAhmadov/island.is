import { Test } from '@nestjs/testing'
import { EndorsementTag } from '../../../endorsementList/endorsementList.model'
import {
  UniqueWithinTagsInput,
  UniqueWithinTagsValidatorService,
} from './uniqueWithinTagsValidator.service'

const getNestModule = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [UniqueWithinTagsValidatorService],
  }).compile()

  return moduleRef.get<UniqueWithinTagsValidatorService>(
    UniqueWithinTagsValidatorService,
  )
}

describe('uniqueWithinTagsValidator', () => {
  let UniqueWithinTagsValidatorService: UniqueWithinTagsValidatorService

  beforeEach(async () => {
    UniqueWithinTagsValidatorService = await getNestModule()
  })

  it('should return failure when watched tag exists in metadata', async () => {
    const input: UniqueWithinTagsInput = {
      value: {
        tags: [EndorsementTag.PARTY_LETTER_2021],
      },
      meta: {
        nationalId: '0101302989',
        signedTags: [
          EndorsementTag.PARTY_LETTER_NORDAUSTURKJORDAEMI_2021,
          EndorsementTag.PARTY_LETTER_2021,
        ],
      },
    }
    const results = await UniqueWithinTagsValidatorService.validate(input)
    expect(results).toBeFalsy()
  })

  it('should return success when watched is missing in metadata', async () => {
    const input: UniqueWithinTagsInput = {
      value: {
        tags: [EndorsementTag.PARTY_LETTER_REYKJAVIKURKJORDAEMI_NORDUR_2021],
      },
      meta: {
        nationalId: '0101302989',
        signedTags: [
          EndorsementTag.PARTY_LETTER_NORDAUSTURKJORDAEMI_2021,
          EndorsementTag.PARTY_LETTER_2021,
        ],
      },
    }
    const results = await UniqueWithinTagsValidatorService.validate(input)
    expect(results).toBeTruthy()
  })
})
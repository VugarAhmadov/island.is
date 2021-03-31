import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { IcelandicNameController } from '../../icelandic-name.controller'
import { IcelandicNameService } from '../../icelandic-name.service'
import { IcelandicName } from '../../icelandic-name.model'
import { CreateIcelandicNameBody } from '../../dto'

describe('IcelandicNameController', () => {
  let icelandicNameController: IcelandicNameController
  let icelandicNameService: IcelandicNameService

  const icelandicName = {
    id: 1,
    icelandic_name: 'Laqueesha',
    type: 'ST',
    status: 'Haf',
    visible: true,
    verdict: 'verdict',
    url: 'url',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IcelandicNameController,
        {
          provide: IcelandicNameService,
          useClass: jest.fn(() => ({
            getAll: () => ({}),
            getByInitialLetter: () => ({}),
            getById: () => ({}),
            updateNameById: () => ({}),
            createName: () => ({}),
            deleteById: () => ({}),
          })),
        },
        {
          provide: getModelToken(IcelandicName),
          useClass: jest.fn(() => ({})),
        },
      ],
    }).compile()

    icelandicNameController = moduleRef.get<IcelandicNameController>(
      IcelandicNameController,
    )
    icelandicNameService = moduleRef.get<IcelandicNameService>(
      IcelandicNameService,
    )
  })

  describe('create', () => {
    const icelandicNameDto: CreateIcelandicNameBody = {
      icelandic_name: 'Laqueesha',
      type: 'ST',
      status: 'Haf',
      visible: true,
      verdict: 'verdict',
      url: 'url',
    }

    it('should create an icelandic name ', async () => {
      jest
        .spyOn(icelandicNameService as any, 'createName')
        .mockImplementation(() => Promise.resolve(icelandicName))

      const result = await icelandicNameController.createName(icelandicNameDto)

      expect(result).toEqual(icelandicName)
    })
  })
})

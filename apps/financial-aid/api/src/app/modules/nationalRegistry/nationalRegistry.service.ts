import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import { NationalRegistryPerson } from './models/nationalRegistryPerson.model'

@Injectable()
export class NationalRegistryService {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  async getUserAndSpouse(user: User): Promise<NationalRegistryPerson> {
    const [person, spouse] = await Promise.all([
      this.nationalRegistryXRoadService.getNationalRegistryPerson(
        user.nationalId,
        user.authorization,
      ),
      this.nationalRegistryXRoadService.getSpouse(
        user.nationalId,
        user.authorization,
      ),
    ])

    return {
      nationalId: person.nationalId,
      fullName: person.fullName,
      address: person.address && {
        streetName: person.address.streetName,
        postalCode: person.address.postalCode,
        city: person.address.city,
      },
      spouse: spouse,
    }
  }
}

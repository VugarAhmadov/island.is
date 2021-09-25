import { GenericScope } from '@island.is/auth/scopes'
import request from 'supertest'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { Endorsement } from '../../models/endorsement.model'
import { authNationalId } from './seed'

describe('findByAuthEndorsement', () => {
  it(`GET /endorsement-list/:listId/endorsement/exists should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c9/endorsement/exists',
      )
      .send()
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement/exists should return 404 and error if list does not exist`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement/exists',
      )
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement/exists should return 404 if no endorsement exists on list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba010/endorsement/exists',
      )
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement/exists should return 200 and a valid endorsement`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [GenericScope.internal],
    })
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c9/endorsement/exists',
      )
      .send()
      .expect(200)

    const endorsement = new Endorsement(response.body) // we know we have at least one endorsement
    await expect(endorsement.validate()).resolves.not.toThrow()
  })
})
